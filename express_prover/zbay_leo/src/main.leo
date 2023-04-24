program auction.aleo {

    mapping bids: address => Bid;

    record Bid {
        owner: address,
        gates: u64,
        bidder: address,
        amount: u64,
        is_winner: bool
    }

    transition place_bid(bidder: address, amount: u64) -> Bid {
        assert_eq(self.caller, bidder);
        // Return a new 'Bid' record for the auction bidder.
        return Bid {
            owner: aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh,
            gates: 0u64,
            bidder: bidder,
            amount: amount,
            is_winner: false,
        };
    
    }

    transition reveal_winner(b0: Bid, b1: Bid, b2: Bid) -> Bid {
        assert_eq(self.caller, aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh);

        return b1.amount > b0.amount ? (b2.amount > b1.amount ? b2 : b1) : b0;
    }

    transition finish(bid: Bid) -> Bid {

        assert_eq(self.caller, aleo1fxs9s0w97lmkwlcmgn0z3nuxufdee5yck9wqrs0umevp7qs0sg9q5xxxzh);

        return Bid {
            owner: bid.bidder,
            gates: bid.gates,
            bidder: bid.bidder,
            amount: bid.amount,
            is_winner: true,
        };
    }
}