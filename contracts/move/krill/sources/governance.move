module krill::governance {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    use std::string::String;
    use std::vector;
    use std::option::{Self, Option};

    // Constants
    const PROPOSAL_DURATION: u64 = 604800000;
    const MIN_QUORUM: u64 = 100;
    const EXECUTION_DELAY: u64 = 172800000;
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_PROPOSAL_EXPIRED: u64 = 2;
    const E_ALREADY_VOTED: u64 = 3;
    const E_PROPOSAL_NOT_PASSED: u64 = 4;
    const E_EXECUTION_TOO_EARLY: u64 = 5;

    // Structs
    struct Proposal has key, store {
        id: UID,
        proposer: address,
        title: String,
        description: String,
        proposal_type: String,
        voting_start: u64,
        voting_end: u64,
        execution_time: Option<u64>,
        votes_for: u64,
        votes_against: u64,
        voters: Table<address, bool>,
        status: String,
        metadata: Table<String, String>,
    }

    struct Treasury has key, store {
        id: UID,
        total_funds: u64,
        allocated_funds: Table<ID, u64>,
        spending_limit: u64,
        authorized_spenders: vector<address>,
    }

    // Events
    struct ProposalCreated has copy, drop {
        proposal_id: ID,
        proposer: address,
        title: String,
        voting_end: u64,
    }

    struct VoteCast has copy, drop {
        proposal_id: ID,
        voter: address,
        support: bool,
        weight: u64,
    }

    struct ProposalExecuted has copy, drop {
        proposal_id: ID,
        executor: address,
        timestamp: u64,
    }

    // Public functions
    public fun create_proposal(
        title: String,
        description: String,
        proposal_type: String,
        clock: &Clock,
        ctx: &mut TxContext
    ): ID {
        let current_time = clock::timestamp_ms(clock);
        
        let proposal = Proposal {
            id: object::new(ctx),
            proposer: tx_context::sender(ctx),
            title,
            description,
            proposal_type,
            voting_start: current_time,
            voting_end: current_time + PROPOSAL_DURATION,
            execution_time: option::none(),
            votes_for: 0,
            votes_against: 0,
            voters: table::new(ctx),
            status: std::string::utf8(b"active"),
            metadata: table::new(ctx),
        };

        let proposal_id = object::id(&proposal);
        
        event::emit(ProposalCreated {
            proposal_id,
            proposer: tx_context::sender(ctx),
            title,
            voting_end: proposal.voting_end,
        });

        transfer::share_object(proposal);
        proposal_id
    }

    public fun cast_vote(
        proposal: &mut Proposal,
        support: bool,
        weight: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let voter = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        assert!(current_time <= proposal.voting_end, E_PROPOSAL_EXPIRED);
        assert!(!table::contains(&proposal.voters, voter), E_ALREADY_VOTED);

        if (support) {
            proposal.votes_for = proposal.votes_for + weight;
        } else {
            proposal.votes_against = proposal.votes_against + weight;
        };

        table::add(&mut proposal.voters, voter, support);

        event::emit(VoteCast {
            proposal_id: object::id(proposal),
            voter,
            support,
            weight,
        });
    }

    public fun execute_proposal(
        proposal: &mut Proposal,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock);
        
        assert!(current_time > proposal.voting_end, E_PROPOSAL_EXPIRED);
        assert!(proposal.votes_for > proposal.votes_against, E_PROPOSAL_NOT_PASSED);
        assert!(proposal.votes_for + proposal.votes_against >= MIN_QUORUM, E_PROPOSAL_NOT_PASSED);
        
        if (option::is_none(&proposal.execution_time)) {
            proposal.execution_time = option::some(current_time + EXECUTION_DELAY);
            proposal.status = std::string::utf8(b"passed");
        } else {
            assert!(current_time >= *option::borrow(&proposal.execution_time), E_EXECUTION_TOO_EARLY);
            proposal.status = std::string::utf8(b"executed");
            
            event::emit(ProposalExecuted {
                proposal_id: object::id(proposal),
                executor: tx_context::sender(ctx),
                timestamp: current_time,
            });
        }
    }

    public fun get_proposal_status(proposal: &Proposal): String {
        proposal.status
    }

    public fun get_vote_counts(proposal: &Proposal): (u64, u64) {
        (proposal.votes_for, proposal.votes_against)
    }

    public fun has_voted(proposal: &Proposal, voter: address): bool {
        table::contains(&proposal.voters, voter)
    }
}