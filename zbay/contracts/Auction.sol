// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.18;

/**
 * @title English Blind Auction Contract
 * @author Theo Wallace https://github.com/teoteo123
 */
contract Auction {
    bytes32[64] public commitments;
    uint8 public num_bids = 0;
    uint8 public constant MAX_BIDS = 64;
    address verifier_address;
    address public winner;
    bytes winner_proof;

    constructor(address verifier_contract_address) {
        verifier_address = verifier_contract_address;
    }

    function bid(bytes32 commitment) public biddingOpen {
        commitments[num_bids] = commitment;
        num_bids++;
    }

    modifier biddingOpen() {
        require(num_bids <= MAX_BIDS);
        _;
    }

    function verify(bytes calldata data) public {
            // // function selector from signature
            // bytes4 function_selector = bytes4(keccak256('verify(bytes calldata)'));
            // location of proof_data array ion calldata
            uint proof_data_pointer = bytesToUint(msg.data[4:24]);
            // length of proof_data
            uint proof_data_len = bytesToUint(msg.data[24:44]);
            // array containing proof data
            bytes memory proof = msg.data[proof_data_pointer:proof_data_pointer + proof_data_len];
            // //full calldata for verification contract
            // bytes memory verify_fn_call_data = abi.encodeWithSelector(function_selector, proof_data_pointer, proof_data_len, proof);
            
            (bool success,) = verifier_address.call(data);
            require(success, "Unable to verify your proof.  Sorry!");
            winner = msg.sender;
            winner_proof = proof;
		}

        function bytesToUint(bytes memory b) internal pure returns (uint256) {
            uint256 number;
            for(uint i=0;i<b.length;i++) {
                number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
            }
            return number;
        }
}