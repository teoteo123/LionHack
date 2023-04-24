import WalletConnector from './WalletConnector'
import {getContract, generate_proof, generateAleoResponse} from './components/contractInterface'
import useInput from './hooks/useInput'
import {useEffect, useState} from 'react'
import Button from './components/Button'
import { Input } from './components/Input'
import { placeContractBid, randomSecret } from './components/contractInterface'
import {initializeApp} from "firebase/app";
import { collection, getFirestore, query, getDocs } from "firebase/firestore";
import ThreeTextRow from "./components/ThreeTextRow";

export interface ManagerAbi {
  all_bids: number[]
  commitments: string[]
  secrets: string[]
}

export default function App() {
  const [error, setError] = useState(false)
  const [verified, setVerified] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [Verifying, setVerifying] = useState(false)
  const [combined, setCombined] = useState<CompoundBid[]>([])
  const [commitment, setCommitment] = useState<string>()
  const [winningAleoRecord, setWinningAleoRecord] = useState<string>()

  interface CompoundBid {
    value: number | string,
    hash: string,
    secret: string
  }

  const bid = useInput(0)

  useEffect(() => {
    //get updated list of commitments from contract and update state
    reloadCommitments()
  }, [])

  async function getFirebaseBids() {
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

    const q = query(firestoreCollectionRef)
    const querySnapshot = await getDocs(q);
    setCombined([])
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const {value, secret, commitment} = data
      setCombined(combined => [...combined, {value, secret, hash: commitment} as CompoundBid])
    })
  }

  const verifyWithBackend = async () => {
    setVerified(false)
    setError(false)
    setVerifying(true)
    let commitments: string[] = []
    let all_bids: number[] = []
    let secrets: string[] = []

    combined.forEach(e => {
      all_bids.push(Number(e.value))
      secrets.push(e.secret.toString())
      commitments.push(e.hash.toString())
    })

    const abi = { all_bids, secrets, commitments  }
    console.log(abi)
    // Verify cool zk winner of nothing with Aztec Noir backend
    let commitmentResponse = await generate_proof(abi).catch((error: any) => {
      setErrorMsg(error.toString())
      setError(true)
      setVerifying(false)
    })

    const aleoResData = await generateAleoResponse(abi)
    
    if (aleoResData.winning_commitment !== commitmentResponse) {
      setErrorMsg('Aleo and Aztec determined different winners... OOPSIE!')
      setError(true)
    }

    if (commitmentResponse && aleoResData) {
      setVerified(true)
      setCommitment(commitmentResponse)
    }

    setWinningAleoRecord(aleoResData.winning_record)
    setVerifying(false)
  }

  // place contract bid from value in bid input
  async function placeBid() {
    const randSecret = randomSecret()
    // place bid
    try {
      await placeContractBid(randSecret, bid.value)
      await getFirebaseBids()
    } catch (err) {
      setErrorMsg((err as any).message)
      setError(true)
      setVerifying(false)
    }
  }

  async function reloadCommitments() {
    setCombined([])
    await getFirebaseBids()
  }

  const btnStyle = 'text-green-600 bg-slate-800 w-52 hover:shadow-lg  hover:bg-slate-500 transition-all'

  return (
    <>
      <div className='mx-auto my-auto'>
        <div>
          <h1 className='text-white text-4xl font-sans font-medium text-green-500'>ZBay</h1>
          <br />
          <Input
            value={bid.value}
            onChange={bid.onChange}
            type='number'
            className='bg-slate-800 border-none focus:bg-slate-600 transition-all'
          />
          <div className='flex flex-row justify-center m-5 space-x-2'>
            <Button onClick={placeBid} className={btnStyle} text='Place Bid' />
            <Button onClick={verifyWithBackend} className={btnStyle} text='Prove + verify' />
            <Button onClick={reloadCommitments} className={btnStyle} text='Reload Commitments' />
          </div>
          {error ? <p className='text-red text-left'>{errorMsg}</p> : <div />}
        </div>
        <div className='p-8 bg-slate-800 rounded-lg text-green-600 space-y-5 text-xs'>
          {combined.map(combinedBid => (
            <ThreeTextRow
              t1={'$' + combinedBid.value}
              t2={'secret: ' + combinedBid.secret}
              t3={'commitment: ' + combinedBid.hash}
            ></ThreeTextRow>
          ))}
        </div>
        <p className='p-8 bg-slate-800 rounded-lg text-green-600 space-y-5 text-xs mt-5 max-w-xl mx-auto'>
          Noir -- {commitment && `Winner's commitment hash: ${commitment}`}
        </p>
          <p className='p-8 bg-slate-800 rounded-lg text-green-600 space-y-5 text-xs mt-5 max-w-xl mx-auto'>
            Leo -- {verified && `Winner's Leo record: ${winningAleoRecord}`}
          </p>
      </div>
      <WalletConnector />
    </>
  )
}
