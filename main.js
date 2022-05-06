import { createClient } from 'redis'
import express from 'express'
import cors from 'cors'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const port = process.env.PORT || 3000

const client = createClient({
  url: REDIS_URL,
})

client.on('error', (err) => console.log('Redis Client Error', err))

await client.connect()

await client.set('key', 'redis connected to ' + REDIS_URL)
const value = await client.get('key')
console.log(value)

const app = express()
app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => res.send('It is working, good job'))

app.get('/item', (req, res) => {
  const key = req.query.id
  client.get(key).then((value) => res.send(value))
})

app.post('/item', (req, res) => {
  const { id, val } = req.body
  console.log(id, val)
  client
    .set(id, val)
    .then((_) => res.send('ok'))
    .catch((err) => res.status(500).send(err.message))
})

app.delete('/item', (req, res) => {
  const { id } = req.body
  client.del(id).then((_) => res.send('ok'))
})

app.get('/items', (req, res) => {
  client.keys('*').then((keys) => res.send(JSON.stringify(keys)))
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
