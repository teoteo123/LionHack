import { readFileSync, writeFileSync } from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import { exec, execSync } from 'child_process'
import cors from 'cors'

const app = express()
app.use(
  cors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE, HEAD, OPTIONS',
  })
)
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

  const toml =
    'all_bids = [' +
    inputs.all_bids.toString() +
    ']\ncommitments = [' +
    inputs.commitments.map(i => '"' + i + '"') +
    ']\nsecrets = [' +
    inputs.secrets.map(i => '"' + i + '"') +
    ']'

  writeFileSync('./zbay_noir/Prover.toml', toml)

  execSync('nargo check', { cwd: './zbay_noir' })
  exec('nargo prove p && nargo verify p', { cwd: './zbay_noir' }).on('exit', (o, a) => {
    console.log('proof generated')
    console.log(a)
    console.log(o)
    const file = readFileSync('./zbay_noir/Verifier.toml')
    const start = file.indexOf('return = "') + 10
    const end = start + 66
    const winner = file.toString().substring(start, end)
    res.json({ commitment: winner })
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
    cwd: './user',
  }).on('exit', () => {
    const output = readFileSync('./user/Verifier.toml').toString()
    hash = output.trimEnd().substring(10, output.length - 2)

    res.json({ hash })
  })
}

async function finalizeAuctionInLeo(req: express.Request, res: express.Response) {
  // Alleged Aleo users (folklore)
  const users = [
    'aleo1yzlta2q5h8t0fqe0v6dyh9mtv4aggd53fgzr068jvplqhvqsnvzq7pj2ke',
    'aleo1esqchvevwn7n5p84e735w4dtwt2hdtu4dpguwgwy94tsxm2p7qpqmlrta4',
    'aleo18fyk2hzy7fxh7tkwu2m274jcmu4l7ftd8uvp8cwc2y24frzsggyq44hcc9',
  ]

  const body = req.body as ManagerAbi
  const bids = body.all_bids
  const commitments = body.commitments
  // all bid outputs from aleo
  let aleoBidOuts: string[] = []
  //place bids in aleo for each user
  bids.forEach((bid, i) => {
    setUser('b' + i)
    console.log('Placing bid...')
    const outBuf = execSync(`leo run place_bid ${users[i]} ${bid}u64`, {
      cwd: './zbay_leo',
    })
    // NEED TO STRIP EVERYTHING NOT IN BRACKETS
    const stdOutString = outBuf.toString('utf8')
    console.log('BID ACCEPTED BY ALEO: ' + stdOutString)
    const aleoOut = stdOutString.substring(stdOutString.indexOf('{'), stdOutString.indexOf('}') + 1)
    aleoBidOuts.push(aleoOut)
  })
  // resolve the auction winner
  console.log('Resolving winner')
  setUser('auctioneer')
  let unfinishedWinner = sanitizeAleoStdoutBuf(
    execSync(
      'leo run reveal_winner ' +
        '"' +
        aleoBidOuts[0] +
        '" ' +
        '"' +
        aleoBidOuts[1] +
        '" ' +
        '"' +
        aleoBidOuts[2] +
        '"',
      {
        cwd: './zbay_leo',
      }
    )
  )

  // Winning Aleo bid record with ownership returned to bidder
  let winningRecord = sanitizeAleoStdoutBuf(
    execSync('leo run finish "' + unfinishedWinner + '"', { cwd: './zbay_leo' })
  )
  console.log('Winner: ' + winningRecord)

  let winningCommitment = 'N/a'
  users.forEach((user, i) => {
    if (winningRecord.indexOf(user) >= 0) {
      winningCommitment = commitments[i]
    }
  })

  res.json({ winning_record: winningRecord, winning_commitment: winningCommitment })
}

function sanitizeAleoStdoutBuf(stdoutBuf: Buffer): string {
  const stdoutString = stdoutBuf.toString()
  return stdoutString.substring(stdoutString.indexOf('{'), stdoutString.indexOf('}') + 1)
}

const setUser = (user: string) => {
  const switchUserCommand = `./set_user.sh ${user}`
  execSync(switchUserCommand, {
    cwd: './zbay_leo',
  })
}

app.post('/', handler)
app.post('/hash', hash)
app.post('/leo', finalizeAuctionInLeo)

const port = 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}
        To generate a proof, curl -X get http://localhost:${port}/
    `)
})
