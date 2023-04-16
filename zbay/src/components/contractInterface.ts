import { ethers } from 'ethers'
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { Buffer } from 'buffer';

import Auction from './Auction.json'
import { ManagerAbi } from "../App";
const DEPLOYED_CONTRACT_ADDRESS = '0x3085e6A275A6903eE6bF475eb03bFC9c65fC0604'
// @ts-ignore
window.Buffer = Buffer;

// turns js number into format '0x0000000000000000000000000000000000000000000000000000000000000000'
export function numberTo32ByteHexString(num: BigInt | number) {
  const numString = num.toString(16)
  return '0x' + '0'.repeat(64 - numString.length) + numString
}

export function randomSecret() {
    const values = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
    let key = "0x";
    for (let i = 0; i < 64; i++) {
        key = key + values[Math.floor(Math.random() * 16)]
    }
    return key
}

export async function getContract() {
  const abi = Auction.abi

  // const { INFURA_API_KEY } = process.env
  // let provider = ethers.getDefaultProvider(`https://goerli.infura.io/${INFURA_API_KEY}`)
  const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
  return new ethers.Contract(DEPLOYED_CONTRACT_ADDRESS, abi, signer)
}

export async function getBidCommitments() {
	const contract = await getContract()
	let bids: string[] = []
	for (let i = 0; i < (await contract.num_bids()); i++) {
		bids.push(await contract.commitments(i))
	}
	return bids
}

export async function buildHash(secret: string, bidValue: number) {
    const response = await fetch('http://localhost:5000/hash', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            secret, bidValue
        })
    })
    if (response.body === null) {
        throw new Error('error fetching proof')
    }
    const json = await response.json()
    const commitment = json['hash']
    if (!commitment) throw new Error('couldn\'t read buffer')
    const firebaseConfig = {
        apiKey: "AIzaSyC_d3yae5Z86CFuEnlHPwejgaNBc8aD6wk",
        authDomain: "lionhack-aztec.firebaseapp.com",
        projectId: "lionhack-aztec",
        storageBucket: "lionhack-aztec.appspot.com",
        messagingSenderId: "705949323612",
        appId: "1:705949323612:web:7d361225c2e05087f57199"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app)
    const firestoreCollectionRef = collection(db, `${(await getContract()).address}`)
    await addDoc(firestoreCollectionRef, {secret, value: bidValue, commitment})
    return commitment
}


export async function placeContractBid(secret: string, bidValue: number) {
    const contract = await getContract();
    const commitment = await buildHash(secret, bidValue)
    contract.bid(commitment)
  console.log(commitment)
}

export async function generate_proof(abi: ManagerAbi) {
  const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(abi)
  })
    const json = await response.json()
    if (json === null) {
        throw new Error('error fetching proof')
    }
    const proof = json.proof
    if (!proof) throw new Error('couldn\'t read buffer')
    console.log(proof)

    return proof
}
