// // @ts-ignore
// import initialiseResolver from "@noir-lang/noir-source-resolver"
// import initNoirWasm, { acir_from_bytes } from "@noir-lang/noir_wasm"
// import initBackend, * as aztec_backend from "@noir-lang/aztec_backend"
// import compiled from '../components/main.json'
// import { StandardExampleProver } from '@noir-lang/barretenberg/dest/client_proofs/generic_proof/standard_example_prover'
//
// export interface abi {
//     bid: number
//     secret: number
// }
//
// export interface ManagerAbi {
//     all_bids: number[]
//     commitments: string[]
//     secrets: string[]
// }
//
// export async function prover(abi: ManagerAbi) {
//     const prover = StandardExampleProver()
//
//
// }
//
// export async function generateProof(abi: ManagerAbi) {
//     await initNoirWasm()
//     await initBackend()
//
//     // @ts-ignore
//     const barretenberg = await BarretenbergWasm.new()
//     await barretenberg.init()
//
//     let circuit = compiled.circuit
//     const acir = acir_from_bytes(new Uint8Array(Buffer.from(circuit)))
//     console.log(acir)
//
//     const [prover,] = await setup_generic_prover_and_verifier(acir)
//     const proof = await create_proof(prover, acir, abi)
//     console.log(proof)
//     return proof
// }
export {}
