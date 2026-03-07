# Verification Proof: EarlyChainLetter10ETH

**Contract:** [`0xa327075af2a223a1c83a36ada1126afe7430f955`](https://etherscan.io/address/0xa327075af2a223a1c83a36ada1126afe7430f955)
**Block:** 49,931 (August 8, 2015)
**Deployer:** `0x881b0A4e9c55d08e31d8d3C022144d75A454211c`

## What is this?

One of the earliest chain-letter investment contracts on Ethereum, deployed just 9 days after mainnet launch. Accepts 10 ETH per entry and redistributes funds to earlier participants in a tree structure.

The contract uses a tree-based payout scheme: the first 3 investors pay out to the root, then as the tree grows, payouts split between levels. Each level gets 5 ETH per investor, with remaining balance distributed proportionally up the tree.

## Source Code

```solidity
contract MyScheme {
    uint treeBalance;
    uint numInvestorsMinusOne;
    uint treeDepth;
    address[] myTree;

    function MyScheme() {
        treeBalance = 0;
        myTree.length = 6;
        myTree[0] = msg.sender;
        numInvestorsMinusOne = 0;
    }

    function getNumInvestors() constant returns (uint a) {
        a = numInvestorsMinusOne + 1;
    }

    function() {
        uint amount = msg.value;
        if (amount >= 10000000000000000000) {
            numInvestorsMinusOne += 1;
            myTree[numInvestorsMinusOne] = msg.sender;
            amount -= 10000000000000000000;
            treeBalance += 10000000000000000000;
            if (numInvestorsMinusOne <= 2) {
                myTree[0].send(treeBalance);
                treeBalance = 0;
                treeDepth = 1;
            } else if (numInvestorsMinusOne + 1 == myTree.length) {
                for (uint i = myTree.length - 3 * (treeDepth + 1); i < myTree.length - treeDepth - 2; i++) {
                    myTree[i].send(5000000000000000000);
                    treeBalance -= 5000000000000000000;
                }
                uint eachLevelGets = treeBalance / (treeDepth + 1) - 1;
                uint numInLevel = 1;
                for (i = 0; i < myTree.length - treeDepth - 2; i++) {
                    myTree[i].send(eachLevelGets / numInLevel - 1);
                    treeBalance -= eachLevelGets / numInLevel - 1;
                    if (numInLevel * (numInLevel + 1) / 2 - 1 == i) {
                        numInLevel += 1;
                    }
                }
                myTree.length += treeDepth + 3;
                treeDepth += 1;
            }
        }
        treeBalance += amount;
    }
}
```

## Compiler

- **Version:** soljson v0.1.1+commit.6ff4cd6
- **Binary:** [soljson-v0.1.1+commit.6ff4cd6.js](https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js)
- **Optimizer:** ON
- **Match:** Byte-for-byte identical, all 925 bytes of creation bytecode

## Verification

```bash
curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
npm install solc
node verify.js
```

## Files

- `MyScheme.sol` - Source code
- `verify.js` - Verification script
- `onchain-creation.hex` - Creation bytecode from deployment tx

## On-chain Data

- **Creation tx:** [`0xe5da56901c48d12e17ed9bc731dcd1d7424f8423d588ec943f8ec48552683c66`](https://etherscan.io/tx/0xe5da56901c48d12e17ed9bc731dcd1d7424f8423d588ec943f8ec48552683c66)
- **Function:** `getNumInvestors()` returns number of participants
- **Entry cost:** 10 ETH per investor

## Context

Chain-letter and pyramid contracts were among the earliest "applications" deployed on Ethereum. Before DeFi, before NFTs, before DAOs - people were experimenting with financial incentive structures on-chain. This contract is a historical artifact of that experimentation, deployed when ETH was worth less than $1.

Part of the [Ethereum History](https://ethereumhistory.com) verification effort - [awesome-ethereum-proofs](https://github.com/cartoonitunes/awesome-ethereum-proofs).
