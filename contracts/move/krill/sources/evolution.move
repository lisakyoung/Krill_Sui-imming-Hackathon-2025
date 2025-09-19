module krill::evolution {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    /// Content that can evolve
    struct EvolvingContent has key, store {
        id: UID,
        creator: address,
        title: String,
        evolution_level: u64,
        branches: vector<ID>,
        view_count: u64,
        engagement_score: u64,
    }

    /// Evolution branch
    struct ContentBranch has key, store {
        id: UID,
        parent_content: ID,
        trigger_type: String,
        threshold: u64,
        content_cid: String,
        discoverer: address,
        created_at: u64,
    }

    /// Events
    struct ContentEvolved has copy, drop {
        content_id: ID,
        new_level: u64,
        discoverer: address,
    }

    /// Create new evolving content
    public fun create_content(
        title: String,
        content_cid: String,
        ctx: &mut TxContext
    ): EvolvingContent {
        EvolvingContent {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            title,
            evolution_level: 0,
            branches: vector::empty(),
            view_count: 0,
            engagement_score: 0,
        }
    }

    /// Trigger content evolution
    public fun evolve_content(
        content: &mut EvolvingContent,
        new_content_cid: String,
        ctx: &mut TxContext
    ): ContentBranch {
        content.evolution_level = content.evolution_level + 1;
        content.engagement_score = content.engagement_score + 10;

        let branch = ContentBranch {
            id: object::new(ctx),
            parent_content: object::uid_to_inner(&content.id),
            trigger_type: string::utf8(b"manual"),
            threshold: content.view_count,
            content_cid: new_content_cid,
            discoverer: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        vector::push_back(&mut content.branches, object::uid_to_inner(&branch.id));

        event::emit(ContentEvolved {
            content_id: object::uid_to_inner(&content.id),
            new_level: content.evolution_level,
            discoverer: tx_context::sender(ctx),
        });

        branch
    }
}