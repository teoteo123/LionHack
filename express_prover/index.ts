import { readFileSync, writeFileSync } from 'fs';
import targetJson from './main.json'

import express from 'express'
import bodyParser from "body-parser"
import { spawn, exec } from "child_process"
import cors from 'cors'

const app = express()
app.use(cors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE, HEAD, OPTIONS'
}))
app.use(bodyParser.json())

export interface HashInputs {
    secret: string
    bidValue: number
}

export interface ManagerAbi {
    all_bids: number[]
    commitments: string[]
    secrets: string[]
}


async function handler(req: express.Request, res: express.Response) {

    const inputs: ManagerAbi = req.body

    const toml = 'all_bids = [' + inputs.all_bids.toString() + ']\ncommitments = [' + inputs.commitments.map(i => '"'+i+'"') + ']\nsecrets = [' + inputs.secrets.map(i => '"'+i+'"') + ']'

    writeFileSync('./Prover.toml', toml)

    exec('nargo check')
    exec('nargo prove p && nargo verify p').on('exit', (o, a) => {
        console.log('proof generated')
        console.log(a)
        console.log(o)
        const file = readFileSync('./Verifier.toml')
        const start = file.indexOf('return = "') + 10
        const end = start + 66
        const winner = file.toString().substring(start, end)
        res.json({ proof: winner })
    })
}
async function hash(req: express.Request, res: express.Response) {
    const { bidValue, secret } = req.body
    //TODO make a toml writer
    const toml = 'bid_price = ' + bidValue + '\nsecret = "' + secret + '"'
    writeFileSync('./user/Prover.toml', toml)
    console.log('wrote prover toml')
    let hash
    exec('nargo check && nargo prove p', {
        cwd: './user'
    }).on('exit', () => {
        const output = readFileSync('./user/Verifier.toml').toString()
        hash = output.trimEnd().substring(10, output.length - 2)


        res.json({ hash })
    })

}
async function verify(req: express.Request, res: express.Response) {
    const { proof } = req.body
    writeFileSync('proofs/p.proof', proof)
    exec('nargo verify p').on('exit', (exitCode) => {
        if (exitCode !== 0) {
            const file = readFileSync('./Verifier.toml')
            const start = file.indexOf('return = "') + 10
            const end = start + 66
            const winner = file.toString().substring(start, end)
            res.status(400).end('error verifying')
            return
        }
        res.status(200).end('this proof is valid!')
    })

}

app.post('/', handler)
app.post('/hash', hash)
app.post('/verify', verify)


const port = 5000

app.listen(port, () => {
    console.log(`Listening on port ${port}
        To generate a proof, curl -X get http://localhost:${port}/
    `)
})