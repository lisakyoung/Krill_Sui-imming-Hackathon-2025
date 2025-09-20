module krill::vault {
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
    const MIN_LOCK_DURATION: u64 = 86400000;
    const MAX_LOCK_DURATION: u64 = 31536000000;
    const PLATFORM_VAULT_FEE: u64 = 200;
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_VAULT_LOCKED: u64 = 2;
    const E_VAULT_NOT_READY: u64 = 3;
    const E_INVALID_DURATION: u64 = 4;
    const E_INSUFFICIENT_AMOUNT: u64 = 5;
    const E_INVALID_RECIPIENT: u64 = 6;
    const E_VAULT_ALREADY_CLAIMED: u64 = 7;
    const E_NOT_RECIPIENT: u64 = 8;

    // Structs
    struct TimeVault has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content_hash: Option<String>,
        locked_amount: Balance<SUI>,
        unlock_time: u64,
        recipients: vector<address>,
        recipient_shares: Table<address, u64>,
        claimed: Table<address, bool>,
        total_claimed: u64,
        is_active: bool,
        metadata: Table<String, String>,
        created_at: u64,
        vault_type: VaultType,
    }

    struct VaultType has store, drop {
        is_milestone: bool,
        is_scheduled: bool,
        is_conditional: bool,
        condition_met: bool,
    }

    // Events
    struct VaultCreated has copy, drop {
        vault_id: ID,
        creator: address,
        unlock_time: u64,
        locked_amount: u64,
        recipients_count: u64,
        timestamp: u64,
    }

    struct VaultUnlocked has copy, drop {
        vault_id: ID,
        recipient: address,
        amount_claimed: u64,
        timestamp: u64,
    }

    // Public functions
    public fun create_time_vault(
        title: String,
        description: String,
        unlock_time: u64,
        recipients: vector<address>,
        shares: vector<u64>,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        let current_time = clock::timestamp_ms(clock);
        let lock_duration = unlock_time - current_time;
        
        assert!(lock_duration >= MIN_LOCK_DURATION, E_INVALID_DURATION);
        assert!(lock_duration <= MAX_LOCK_DURATION, E_INVALID_DURATION);
        assert!(vector::length(&recipients) == vector::length(&shares), E_INVALID_RECIPIENT);
        
        let total_amount = coin::value(&payment);
        assert!(total_amount > 0, E_INSUFFICIENT_AMOUNT);

        let vault = TimeVault {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            title,
            description,
            content_hash: option::none(),
            locked_amount: coin::into_balance(payment),
            unlock_time,
            recipients: vector::empty(),
            recipient_shares: table::new(ctx),
            claimed: table::new(ctx),
            total_claimed: 0,
            is_active: true,
            metadata: table::new(ctx),
            created_at: current_time,
            vault_type: VaultType {
                is_milestone: false,
                is_scheduled: true,
                is_conditional: false,
                condition_met: false,
            },
        };

        let i = 0;
        let total_shares = 0;
        while (i < vector::length(&recipients)) {
            let recipient = *vector::borrow(&recipients, i);
            let share = *vector::borrow(&shares, i);
            
            vector::push_back(&mut vault.recipients, recipient);
            table::add(&mut vault.recipient_shares, recipient, share);
            table::add(&mut vault.claimed, recipient, false);
            total_shares = total_shares + share;
            
            i = i + 1;
        };
        
        assert!(total_shares == 10000, E_INVALID_RECIPIENT);

        let vault_id = object::id(&vault);
        
        event::emit(VaultCreated {
            vault_id,
            creator: tx_context::sender(ctx),
            unlock_time,
            locked_amount: total_amount,
            recipients_count: vector::length(&recipients),
            timestamp: current_time,
        });

        transfer::share_object(vault);
        vault_id
    }

    public fun claim_from_vault(
        vault: &mut TimeVault,
        clock: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> {
        let claimer = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        assert!(vault.is_active, E_VAULT_LOCKED);
        assert!(current_time >= vault.unlock_time || vault.vault_type.condition_met, E_VAULT_NOT_READY);
        assert!(vector::contains(&vault.recipients, &claimer), E_NOT_RECIPIENT);
        assert!(!*table::borrow(&vault.claimed, claimer), E_VAULT_ALREADY_CLAIMED);

        let share_percentage = *table::borrow(&vault.recipient_shares, claimer);
        let total_amount = balance::value(&vault.locked_amount);
        
        let platform_fee = (total_amount * PLATFORM_VAULT_FEE) / 10000;
        let distributable = total_amount - platform_fee;
        let claim_amount = (distributable * share_percentage) / 10000;

        *table::borrow_mut(&mut vault.claimed, claimer) = true;
        vault.total_claimed = vault.total_claimed + claim_amount;

        let claimed_coin = coin::from_balance(
            balance::split(&mut vault.locked_amount, claim_amount),
            ctx
        );

        event::emit(VaultUnlocked {
            vault_id: object::id(vault),
            recipient: claimer,
            amount_claimed: claim_amount,
            timestamp: current_time,
        });

        if (vault.total_claimed >= distributable) {
            vault.is_active = false;
        }

        claimed_coin
    }

    public fun cancel_vault(
        vault: &mut TimeVault,
        clock: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(tx_context::sender(ctx) == vault.creator, E_NOT_AUTHORIZED);
        assert!(vault.is_active, E_VAULT_LOCKED);
        assert!(clock::timestamp_ms(clock) < vault.unlock_time, E_VAULT_NOT_READY);
        assert!(vault.total_claimed == 0, E_VAULT_ALREADY_CLAIMED);

        vault.is_active = false;
        
        coin::from_balance(
            balance::withdraw_all(&mut vault.locked_amount),
            ctx
        )
    }

    public fun update_milestone(
        vault: &mut TimeVault,
        current_value: u64,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        assert!(vault.vault_type.is_milestone, E_VAULT_LOCKED);
        
        if (current_value >= 100) {
            vault.vault_type.condition_met = true;
            vault.unlock_time = clock::timestamp_ms(clock);
        }
    }
}