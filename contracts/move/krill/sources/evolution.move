module krill::evolution {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use std::string::String;
    use std::vector;
    use std::option::{Self, Option};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};

    // Constants
    const MIN_EVOLUTION_THRESHOLD: u64 = 100;
    const MAX_BRANCHES: u64 = 50;
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_EVOLUTION: u64 = 2;
    const E_MAX_BRANCHES_REACHED: u64 = 3;
    const E_INSUFFICIENT_ENGAGEMENT: u64 = 4;
    const E_COOLDOWN_ACTIVE: u64 = 5;

    // Structs
    struct EvolvingContent has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content_hash: String,
        evolution_level: u64,
        total_views: u64,
        total_engagement: u64,
        branches: vector<ID>,
        parent_id: Option<ID>,
        metadata: Table<String, String>,
        revenue: Balance<SUI>,
        is_locked: bool,
        created_at: u64,
        last_evolved: u64,
        evolution_threshold: u64,
        creator_fee_percentage: u64,
        tier_ids: vector<u64>,
    }

    struct ContentBranch has key, store {
        id: UID,
        parent_content: ID,
        creator: address,
        branch_type: String,
        content_hash: String,
        title: String,
        description: String,
        engagement_score: u64,
        views: u64,
        revenue: Balance<SUI>,
        participants: vector<address>,
        metadata: Table<String, String>,
        created_at: u64,
        is_active: bool,
    }

    struct CreatorProfile has key, store {
        id: UID,
        owner: address,
        total_content: u64,
        total_evolution_level: u64,
        total_revenue: u64,
        reputation_score: u64,
        created_contents: vector<ID>,
        participated_branches: vector<ID>,
        metadata: Table<String, String>,
    }

    // Events
    struct ContentCreated has copy, drop {
        content_id: ID,
        creator: address,
        title: String,
        initial_level: u64,
        timestamp: u64,
    }

    struct ContentEvolved has copy, drop {
        content_id: ID,
        new_level: u64,
        branch_id: ID,
        evolver: address,
        timestamp: u64,
    }

    // Public functions
    public fun create_content(
        title: String,
        description: String,
        content_hash: String,
        evolution_threshold: u64,
        creator_fee: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        assert!(evolution_threshold >= MIN_EVOLUTION_THRESHOLD, E_INVALID_EVOLUTION);
        assert!(creator_fee <= 10000, E_INVALID_EVOLUTION);

        let content = EvolvingContent {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            title,
            description,
            content_hash,
            evolution_level: 1,
            total_views: 0,
            total_engagement: 0,
            branches: vector::empty(),
            parent_id: option::none(),
            metadata: table::new(ctx),
            revenue: balance::zero(),
            is_locked: false,
            created_at: clock::timestamp_ms(clock),
            last_evolved: clock::timestamp_ms(clock),
            evolution_threshold,
            creator_fee_percentage: creator_fee,
        };

        let content_id = object::id(&content);
        let sender = tx_context::sender(ctx);
        
        event::emit(ContentCreated {
            content_id,
            creator: sender,
            title,
            initial_level: 1,
            timestamp: clock::timestamp_ms(clock),
        });

        transfer::share_object(content);
        content_id
    }

    public fun create_branch(
        parent_content: &mut EvolvingContent,
        branch_type: String,
        content_hash: String,
        title: String,
        description: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        assert!(!parent_content.is_locked, E_COOLDOWN_ACTIVE);
        assert!(vector::length(&parent_content.branches) < MAX_BRANCHES, E_MAX_BRANCHES_REACHED);

        let branch = ContentBranch {
            id: object::new(ctx),
            parent_content: object::id(parent_content),
            creator: tx_context::sender(ctx),
            branch_type,
            content_hash,
            title,
            description,
            engagement_score: 0,
            views: 0,
            revenue: balance::zero(),
            participants: vector::empty(),
            metadata: table::new(ctx),
            created_at: clock::timestamp_ms(clock),
            is_active: true,
        };

        let branch_id = object::id(&branch);
        vector::push_back(&mut parent_content.branches, branch_id);
        
        transfer::share_object(branch);
        branch_id
    }

    public fun record_engagement(
        content: &mut EvolvingContent,
        branch: &mut ContentBranch,
        _engagement_type: String,
        score: u64,
        viewer: address,
        _clock: &Clock,
        _ctx: &mut TxContext
    ) {
        branch.engagement_score = branch.engagement_score + score;
        branch.views = branch.views + 1;
        
        if (!vector::contains(&branch.participants, &viewer)) {
            vector::push_back(&mut branch.participants, viewer);
        }

        content.total_engagement = content.total_engagement + score;
        content.total_views = content.total_views + 1;
    }

    public fun process_payment(
        content: &mut EvolvingContent,
        payment: Coin<SUI>,
        _ctx: &mut TxContext
    ) {
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut content.revenue, payment_balance);
    }

    public fun withdraw_earnings(
        content: &mut EvolvingContent,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(tx_context::sender(ctx) == content.creator, E_NOT_AUTHORIZED);
        assert!(balance::value(&content.revenue) >= amount, E_INSUFFICIENT_ENGAGEMENT);
        
        coin::from_balance(balance::split(&mut content.revenue, amount), ctx)
    }

    public fun get_or_create_profile(ctx: &mut TxContext): ID {
        let sender = tx_context::sender(ctx);
        let profile = CreatorProfile {
            id: object::new(ctx),
            owner: sender,
            total_content: 0,
            total_evolution_level: 0,
            total_revenue: 0,
            reputation_score: 100,
            created_contents: vector::empty(),
            participated_branches: vector::empty(),
            metadata: table::new(ctx),
        };
        
        let profile_id = object::id(&profile);
        transfer::transfer(profile, sender);
        profile_id
    }

    pub fun get_content_info( content: &EvolvingContent ) : ( address, vector<u64> ) {
        (
            content.creator,
            content.teir_ids,
        )
    }
    public fun contains_tier(
        v: &vector<u64>, x: u64
    ): bool {
        let len = vector::length(v);
        let mut i = 0;
        while (i < len) {
            if (*vector::borrow(v, i) == x) {
                return true
            };
            i = i + 1;
        };
        false
    }

    entry fun seal_approve(
        sub: &Subscription,             
        content: EvolvingContent,   
    ) {
        // get_file_info로 파일 정보 조회 (tiers_id는 마지막 요소)
        let ( creator, tier_ids ) = main::get_content_info(content);

        // 등급 허용 여부: SubNFT의 tier_id가 FileNFT.tiers_id에 포함되어 있어야 함
        let allowed = contains_tier(&tiers_id, sub.tier_id);
        assert!(allowed, E_NOT_ALLOWED_TIER);
    }

}