const express = require('express')
const PORT = 80

const app = express()

const uuid = require('uuid')
const NODE_ID = uuid.v4()

app.get('/', (req, res) => {
  console.log(`[${new Date()}] Received request...`)
  res.send({
    timestamp: new Date(),
    version: process.env.VERSION,
    node_id: NODE_ID,
    message: "Hello, World!"
  })
})

app.listen(PORT, () => {
  console.log(`Application ${process.env.VERSION} started on port ${PORT} as of ${new Date()}`)
  console.log(`\tUUID: ${NODE_ID}`)
})