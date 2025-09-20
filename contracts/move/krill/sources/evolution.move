module krill::evolution {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::dynamic_object_field as dof;
    use std::string::{Self, String};
    use std::vector;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::balance::{Self, Balance};

    // ===== Constants =====
    const MIN_EVOLUTION_THRESHOLD: u64 = 100;
    const MAX_BRANCHES: u64 = 50;
    const EVOLUTION_COOLDOWN: u64 = 86400000; // 24 hours in ms
    
    // ===== Error Codes =====
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_EVOLUTION: u64 = 2;
    const E_MAX_BRANCHES_REACHED: u64 = 3;
    const E_INSUFFICIENT_ENGAGEMENT: u64 = 4;
    const E_COOLDOWN_ACTIVE: u64 = 5;
    const E_CONTENT_LOCKED: u64 = 6;
    const E_INVALID_BRANCH: u64 = 7;
    const E_INSUFFICIENT_PAYMENT: u64 = 8;

    // ===== Structs =====
    
    /// Main evolving content struct
    struct EvolvingContent has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content_hash: String, // IPFS/Walrus hash
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
        creator_fee_percentage: u64, // Basis points (e.g., 500 = 5%)
    }

    /// Evolution branch
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

    /// Engagement metrics
    struct EngagementMetrics has store {
        likes: u64,
        shares: u64,
        comments: u64,
        remixes: u64,
        time_spent: u64,
        unique_viewers: vector<address>,
    }

    /// Creator profile
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

    // ===== Events =====
    
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

    struct BranchCreated has copy, drop {
        branch_id: ID,
        parent_content: ID,
        creator: address,
        branch_type: String,
        timestamp: u64,
    }

    struct RevenueDistributed has copy, drop {
        content_id: ID,
        amount: u64,
        creator_share: u64,
        platform_share: u64,
        timestamp: u64,
    }

    struct EngagementRecorded has copy, drop {
        content_id: ID,
        viewer: address,
        engagement_type: String,
        score: u64,
        timestamp: u64,
    }

    // ===== Public Functions =====
    
    /// Create new evolving content
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
        assert!(creator_fee <= 10000, E_INVALID_EVOLUTION); // Max 100%

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
        
        event::emit(ContentCreated {
            content_id,
            creator: tx_context::sender(ctx),
            title,
            initial_level: 1,
            timestamp: clock::timestamp_ms(clock),
        });

        transfer::share_object(content);
        content_id
    }

    /// Create evolution branch
    public fun create_branch(
        parent_content: &mut EvolvingContent,
        branch_type: String,
        content_hash: String,
        title: String,
        description: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        assert!(!parent_content.is_locked, E_CONTENT_LOCKED);
        assert!(vector::length(&parent_content.branches) < MAX_BRANCHES, E_MAX_BRANCHES_REACHED);
        
        let current_time = clock::timestamp_ms(clock);
        assert!(
            current_time >= parent_content.last_evolved + EVOLUTION_COOLDOWN,
            E_COOLDOWN_ACTIVE
        );

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
            created_at: current_time,
            is_active: true,
        };

        let branch_id = object::id(&branch);
        vector::push_back(&mut parent_content.branches, branch_id);
        
        event::emit(BranchCreated {
            branch_id,
            parent_content: object::id(parent_content),
            creator: tx_context::sender(ctx),
            branch_type,
            timestamp: current_time,
        });

        transfer::share_object(branch);
        branch_id
    }

    /// Record engagement and potentially trigger evolution
    public fun record_engagement(
        content: &mut EvolvingContent,
        branch: &mut ContentBranch,
        engagement_type: String,
        score: u64,
        viewer: address,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        branch.engagement_score = branch.engagement_score + score;
        branch.views = branch.views + 1;
        
        if (!vector::contains(&branch.participants, &viewer)) {
            vector::push_back(&mut branch.participants, viewer);
        }

        content.total_engagement = content.total_engagement + score;
        content.total_views = content.total_views + 1;

        event::emit(EngagementRecorded {
            content_id: object::id(content),
            viewer,
            engagement_type,
            score,
            timestamp: clock::timestamp_ms(clock),
        });

        // Check for evolution trigger
        if (branch.engagement_score >= content.evolution_threshold) {
            trigger_evolution(content, branch, clock, ctx);
        }
    }

    /// Process payment for accessing content
    public fun process_payment(
        content: &mut EvolvingContent,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        let payment_balance = coin::into_balance(payment);
        
        // Add to content revenue
        balance::join(&mut content.revenue, payment_balance);
        
        // Emit revenue event (distribution happens separately)
        let creator_share = (amount * content.creator_fee_percentage) / 10000;
        let platform_share = amount - creator_share;
        
        event::emit(RevenueDistributed {
            content_id: object::id(content),
            amount,
            creator_share,
            platform_share,
            timestamp: 0, // Would use clock in production
        });
    }

    /// Withdraw creator earnings
    public fun withdraw_earnings(
        content: &mut EvolvingContent,
        amount: u64,
        ctx: &mut TxContext
    ): Coin<SUI> {
        assert!(tx_context::sender(ctx) == content.creator, E_NOT_AUTHORIZED);
        assert!(balance::value(&content.revenue) >= amount, E_INSUFFICIENT_PAYMENT);
        
        coin::from_balance(balance::split(&mut content.revenue, amount), ctx)
    }

    /// Update content metadata
    public fun update_metadata(
        content: &mut EvolvingContent,
        key: String,
        value: String,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == content.creator, E_NOT_AUTHORIZED);
        
        if (table::contains(&content.metadata, key)) {
            *table::borrow_mut(&mut content.metadata, key) = value;
        } else {
            table::add(&mut content.metadata, key, value);
        }
    }

    /// Lock content (prevent further evolution)
    public fun lock_content(
        content: &mut EvolvingContent,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == content.creator, E_NOT_AUTHORIZED);
        content.is_locked = true;
    }

    /// Get or create creator profile
    public fun get_or_create_profile(
        ctx: &mut TxContext
    ): ID {
        let sender = tx_context::sender(ctx);
        let profile = CreatorProfile {
            id: object::new(ctx),
            owner: sender,
            total_content: 0,
            total_evolution_level: 0,
            total_revenue: 0,
            reputation_score: 100, // Starting reputation
            created_contents: vector::empty(),
            participated_branches: vector::empty(),
            metadata: table::new(ctx),
        };
        
        let profile_id = object::id(&profile);
        transfer::transfer(profile, sender);
        profile_id
    }

    // ===== Private Functions =====
    
    fun trigger_evolution(
        content: &mut EvolvingContent,
        branch: &mut ContentBranch,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        content.evolution_level = content.evolution_level + 1;
        content.last_evolved = clock::timestamp_ms(clock);
        
        event::emit(ContentEvolved {
            content_id: object::id(content),
            new_level: content.evolution_level,
            branch_id: object::id(branch),
            evolver: branch.creator,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // ===== View Functions =====
    
    public fun get_evolution_level(content: &EvolvingContent): u64 {
        content.evolution_level
    }

    public fun get_total_engagement(content: &EvolvingContent): u64 {
        content.total_engagement
    }

    public fun get_branch_count(content: &EvolvingContent): u64 {
        vector::length(&content.branches)
    }

    public fun is_content_locked(content: &EvolvingContent): bool {
        content.is_locked
    }

    public fun get_revenue_balance(content: &EvolvingContent): u64 {
        balance::value(&content.revenue)
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        // Test initialization
    }
}