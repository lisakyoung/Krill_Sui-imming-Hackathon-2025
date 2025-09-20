module krill::subscription {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};
    use std::string::{Self, String};
    use std::vector;

    // ===== Constants =====
    const PLATFORM_FEE_PERCENTAGE: u64 = 500; // 5% in basis points
    const MIN_SUBSCRIPTION_DURATION: u64 = 2592000000; // 30 days in ms
    const MAX_TIERS: u64 = 5;
    
    // ===== Error Codes =====
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;
    const E_SUBSCRIPTION_EXPIRED: u64 = 3;
    const E_ALREADY_SUBSCRIBED: u64 = 4;
    const E_INVALID_TIER: u64 = 5;
    const E_MAX_TIERS_REACHED: u64 = 6;
    const E_TIER_NOT_FOUND: u64 = 7;

    // ===== Structs =====
    
    /// Subscription tier
    struct SubscriptionTier has store {
        tier_id: u64,
        name: String,
        price_per_month: u64,
        perks: vector<String>,
        max_subscribers: Option<u64>,
        current_subscribers: u64,
        is_active: bool,
    }

    /// Creator subscription manager
    struct CreatorSubscriptions has key, store {
        id: UID,
        creator: address,
        tiers: Table<u64, SubscriptionTier>,
        subscribers: Table<address, Subscription>,
        total_subscribers: u64,
        total_revenue: Balance<SUI>,
        pending_withdrawals: Balance<SUI>,
        metadata: Table<String, String>,
        next_tier_id: u64,
    }

    /// Individual subscription
    struct Subscription has store {
        subscriber: address,
        creator: address,
        tier_id: u64,
        start_time: u64,
        end_time: u64,
        auto_renew: bool,
        total_paid: u64,
        is_active: bool,
    }

    /// Share token for creator economy
    struct CreatorShare has key, store {
        id: UID,
        creator: address,
        owner: address,
        share_amount: u64,
        purchase_price: u64,
        purchase_time: u64,
        current_value: u64,
        dividends_earned: u64,
        is_locked: bool,
        lock_until: Option<u64>,
    }

    /// Market data for shares
    struct ShareMarket has key, store {
        id: UID,
        creator: address,
        total_shares: u64,
        available_shares: u64,
        current_price: u64,
        price_history: vector<u64>,
        volume_24h: u64,
        market_cap: u64,
        holders: Table<address, u64>,
    }

    // ===== Events =====
    
    struct SubscriptionCreated has copy, drop {
        subscriber: address,
        creator: address,
        tier_id: u64,
        duration: u64,
        amount: u64,
        timestamp: u64,
    }

    struct SubscriptionRenewed has copy, drop {
        subscriber: address,
        creator: address,
        tier_id: u64,
        new_end_time: u64,
        amount: u64,
    }

    struct SubscriptionCancelled has copy, drop {
        subscriber: address,
        creator: address,
        tier_id: u64,
        timestamp: u64,
    }

    struct SharePurchased has copy, drop {
        buyer: address,
        creator: address,
        amount: u64,
        price: u64,
        timestamp: u64,
    }

    struct ShareSold has copy, drop {
        seller: address,
        creator: address,
        amount: u64,
        price: u64,
        timestamp: u64,
    }

    struct DividendDistributed has copy, drop {
        creator: address,
        total_amount: u64,
        per_share: u64,
        timestamp: u64,
    }

    // ===== Public Functions =====
    
    /// Initialize creator subscriptions
    public fun init_creator_subscriptions(
        ctx: &mut TxContext
    ): ID {
        let subscriptions = CreatorSubscriptions {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            tiers: table::new(ctx),
            subscribers: table::new(ctx),
            total_subscribers: 0,
            total_revenue: balance::zero(),
            pending_withdrawals: balance::zero(),
            metadata: table::new(ctx),
            next_tier_id: 1,
        };
        
        let sub_id = object::id(&subscriptions);
        transfer::share_object(subscriptions);
        sub_id
    }

    /// Add subscription tier
    public fun add_tier(
        subscriptions: &mut CreatorSubscriptions,
        name: String,
        price: u64,
        perks: vector<String>,
        max_subscribers: Option<u64>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == subscriptions.creator, E_NOT_AUTHORIZED);
        assert!(subscriptions.next_tier_id <= MAX_TIERS, E_MAX_TIERS_REACHED);

        let tier = SubscriptionTier {
            tier_id: subscriptions.next_tier_id,
            name,
            price_per_month: price,
            perks,
            max_subscribers,
            current_subscribers: 0,
            is_active: true,
        };

        table::add(&mut subscriptions.tiers, subscriptions.next_tier_id, tier);
        subscriptions.next_tier_id = subscriptions.next_tier_id + 1;
    }

    /// Subscribe to creator
    public fun subscribe(
        subscriptions: &mut CreatorSubscriptions,
        tier_id: u64,
        duration_months: u64,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let subscriber = tx_context::sender(ctx);
        assert!(!table::contains(&subscriptions.subscribers, subscriber), E_ALREADY_SUBSCRIBED);
        assert!(table::contains(&subscriptions.tiers, tier_id), E_TIER_NOT_FOUND);

        let tier = table::borrow_mut(&mut subscriptions.tiers, tier_id);
        assert!(tier.is_active, E_INVALID_TIER);
        
        // Check max subscribers limit
        if (option::is_some(&tier.max_subscribers)) {
            assert!(
                tier.current_subscribers < *option::borrow(&tier.max_subscribers),
                E_INVALID_TIER
            );
        }

        let total_amount = tier.price_per_month * duration_months;
        assert!(coin::value(&payment) >= total_amount, E_INSUFFICIENT_PAYMENT);

        let current_time = clock::timestamp_ms(clock);
        let duration_ms = MIN_SUBSCRIPTION_DURATION * duration_months;
        
        let subscription = Subscription {
            subscriber,
            creator: subscriptions.creator,
            tier_id,
            start_time: current_time,
            end_time: current_time + duration_ms,
            auto_renew: false,
            total_paid: total_amount,
            is_active: true,
        };

        // Process payment
        let payment_balance = coin::into_balance(payment);
        
        // Calculate platform fee
        let platform_fee = (total_amount * PLATFORM_FEE_PERCENTAGE) / 10000;
        let creator_amount = total_amount - platform_fee;
        
        // Add creator's share to pending withdrawals
        balance::join(
            &mut subscriptions.pending_withdrawals,
            balance::split(&mut payment_balance, creator_amount)
        );
        
        // Platform fee would go to platform treasury
        balance::join(&mut subscriptions.total_revenue, payment_balance);

        table::add(&mut subscriptions.subscribers, subscriber, subscription);
        subscriptions.total_subscribers = subscriptions.total_subscribers + 1;
        tier.current_subscribers = tier.current_subscribers + 1;

        event::emit(SubscriptionCreated {
            subscriber,
            creator: subscriptions.creator,
            tier_id,
            duration: duration_ms,
            amount: total_amount,
            timestamp: current_time,
        });
    }

    /// Cancel subscription
    public fun cancel_subscription(
        subscriptions: &mut CreatorSubscriptions,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let subscriber = tx_context::sender(ctx);
        assert!(table::contains(&subscriptions.subscribers, subscriber), E_NOT_AUTHORIZED);

        let subscription = table::borrow_mut(&mut subscriptions.subscribers, subscriber);
        subscription.is_active = false;
        subscription.auto_renew = false;

        let tier = table::borrow_mut(&mut subscriptions.tiers, subscription.tier_id);
        tier.current_subscribers = tier.current_subscribers - 1;
        subscriptions.total_subscribers = subscriptions.total_subscribers - 1;

        event::emit(SubscriptionCancelled {
            subscriber,
            creator: subscriptions.creator,
            tier_id: subscription.tier_id,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Initialize share market for creator
    public fun init_share_market(
        total_shares: u64,
        initial_price: u64,
        ctx: &mut TxContext
    ): ID {
        let market = ShareMarket {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            total_shares,
            available_shares: total_shares,
            current_price: initial_price,
            price_history: vector::singleton(initial_price),
            volume_24h: 0,
            market_cap: total_shares * initial_price,
            holders: table::new(ctx),
        };

        let market_id = object::id(&market);
        transfer::share_object(market);
        market_id
    }

    /// Buy creator shares
    public fun buy_shares(
        market: &mut ShareMarket,
        amount: u64,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        assert!(market.available_shares >= amount, E_INSUFFICIENT_PAYMENT);
        
        let total_cost = amount * market.current_price;
        assert!(coin::value(&payment) >= total_cost, E_INSUFFICIENT_PAYMENT);

        let buyer = tx_context::sender(ctx);
        
        let share = CreatorShare {
            id: object::new(ctx),
            creator: market.creator,
            owner: buyer,
            share_amount: amount,
            purchase_price: market.current_price,
            purchase_time: clock::timestamp_ms(clock),
            current_value: total_cost,
            dividends_earned: 0,
            is_locked: false,
            lock_until: option::none(),
        };

        let share_id = object::id(&share);
        
        // Update market
        market.available_shares = market.available_shares - amount;
        market.volume_24h = market.volume_24h + total_cost;
        
        // Update price based on demand (simple bonding curve)
        market.current_price = market.current_price + (market.current_price * amount / market.total_shares);
        vector::push_back(&mut market.price_history, market.current_price);
        
        // Update holders
        if (table::contains(&market.holders, buyer)) {
            let current = table::borrow_mut(&mut market.holders, buyer);
            *current = *current + amount;
        } else {
            table::add(&mut market.holders, buyer, amount);
        }

        // Handle payment
        transfer::public_transfer(payment, market.creator);

        event::emit(SharePurchased {
            buyer,
            creator: market.creator,
            amount,
            price: market.current_price,
            timestamp: clock::timestamp_ms(clock),
        });

        transfer::transfer(share, buyer);
        share_id
    }

    /// Withdraw creator earnings
    public fun withdraw_earnings(
        subscriptions: &mut CreatorSubscriptions,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(tx_context::sender(ctx) == subscriptions.creator, E_NOT_AUTHORIZED);
        assert!(balance::value(&subscriptions.pending_withdrawals) >= amount, E_INSUFFICIENT_PAYMENT);
        
        coin::from_balance(balance::split(&mut subscriptions.pending_withdrawals, amount), ctx)
    }

    // ===== View Functions =====
    
    public fun get_subscription_status(
        subscriptions: &CreatorSubscriptions,
        subscriber: address,
        clock: &Clock
    ): bool {
        if (!table::contains(&subscriptions.subscribers, subscriber)) {
            return false
        };
        
        let sub = table::borrow(&subscriptions.subscribers, subscriber);
        sub.is_active && sub.end_time > clock::timestamp_ms(clock)
    }

    public fun get_total_subscribers(subscriptions: &CreatorSubscriptions): u64 {
        subscriptions.total_subscribers
    }

    public fun get_pending_earnings(subscriptions: &CreatorSubscriptions): u64 {
        balance::value(&subscriptions.pending_withdrawals)
    }

    public fun get_share_price(market: &ShareMarket): u64 {
        market.current_price
    }

    public fun get_available_shares(market: &ShareMarket): u64 {
        market.available_shares
    }
}