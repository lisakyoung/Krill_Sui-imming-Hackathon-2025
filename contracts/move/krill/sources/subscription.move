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
    use std::string::String;
    use std::vector;
    use std::option::{Self, Option};

    // Constants
    const PLATFORM_FEE_PERCENTAGE: u64 = 500;
    const MIN_SUBSCRIPTION_DURATION: u64 = 2592000000;
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;
    const E_ALREADY_SUBSCRIBED: u64 = 4;
    const E_TIER_NOT_FOUND: u64 = 7;

    // Structs
    struct SubscriptionTier has store {
        tier_id: u64,
        name: String,
        price_per_month: u64,
        perks: vector<String>,
        max_subscribers: Option<u64>,
        current_subscribers: u64,
        is_active: bool,
    }

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

    // Events
    struct SubscriptionCreated has copy, drop {
        subscriber: address,
        creator: address,
        tier_id: u64,
        duration: u64,
        amount: u64,
        timestamp: u64,
    }

    // Public functions
    public fun init_creator_subscriptions(ctx: &mut TxContext): ID {
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

        let payment_balance = coin::into_balance(payment);
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

    public fun buy_shares(
        market: &mut ShareMarket,
        amount: u64,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        let buyer = tx_context::sender(ctx);
        
        let share = CreatorShare {
            id: object::new(ctx),
            creator: market.creator,
            owner: buyer,
            share_amount: amount,
            purchase_price: market.current_price,
            purchase_time: clock::timestamp_ms(clock),
            current_value: amount * market.current_price,
            dividends_earned: 0,
            is_locked: false,
            lock_until: option::none(),
        };

        let share_id = object::id(&share);
        transfer::public_transfer(payment, market.creator);
        transfer::transfer(share, buyer);
        share_id
    }
}