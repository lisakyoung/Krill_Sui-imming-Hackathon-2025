module krill::subscription {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use std::string::String;

    struct Subscription has key, store {
        id: UID,
        creator: address,
        subscriber: address,
        tier: String,
        monthly_price: u64,
        start_time: u64,
        last_payment: u64,
        active: bool,
        perks: vector<String>,
        balance: Balance<SUI>,
    }

    struct SubscriptionTier has key, store {
        id: UID,
        creator: address,
        name: String,
        price: u64,
        perks: vector<String>,
        max_subscribers: u64,
        current_subscribers: u64,
    }

    public fun create_subscription_tier(
        name: String,
        price: u64,
        perks: vector<String>,
        max_subscribers: u64,
        ctx: &mut TxContext
    ) {
        let tier = SubscriptionTier {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            name,
            price,
            perks,
            max_subscribers,
            current_subscribers: 0,
        };
        transfer::share_object(tier);
    }

    public fun subscribe(
        tier: &mut SubscriptionTier,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ): Subscription {
        assert!(tier.current_subscribers < tier.max_subscribers, 1);
        assert!(coin::value(&payment) >= tier.price, 2);
        
        tier.current_subscribers = tier.current_subscribers + 1;
        
        Subscription {
            id: object::new(ctx),
            creator: tier.creator,
            subscriber: tx_context::sender(ctx),
            tier: tier.name,
            monthly_price: tier.price,
            start_time: tx_context::epoch(ctx),
            last_payment: tx_context::epoch(ctx),
            active: true,
            perks: tier.perks,
            balance: coin::into_balance(payment),
        }
    }

    public fun renew_subscription(
        sub: &mut Subscription,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(sub.subscriber == tx_context::sender(ctx), 3);
        assert!(coin::value(&payment) >= sub.monthly_price, 2);
        
        balance::join(&mut sub.balance, coin::into_balance(payment));
        sub.last_payment = tx_context::epoch(ctx);
        sub.active = true;
    }

    public fun cancel_subscription(
        sub: &mut Subscription,
        ctx: &mut TxContext
    ) {
        assert!(sub.subscriber == tx_context::sender(ctx), 3);
        sub.active = false;
    }
}