const express = require('express')
const PORT = 80

const app = express()

const uuid = require('uuid')
const NODE_ID = uuid.v4()

const db = [
  {
    id: "1",
    name: 'Dolo 650 Tablet',
    mrp: 32,
    currency: 'INR',
    description: 'Dolo 650 Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain. It is used to treat headaches, migraine, nerve pain, toothache, sore throat, period (menstrual) pains, arthritis, muscle aches, and the common cold.'
  },
  {
    id: "2",
    name: 'Combiflam Tablet',
    mrp: 30,
    currency: 'INR',
    description: 'Combiflam Tablet contains two painkiller medicines. They work together to reduce pain, fever, and inflammation. It is used to treat many conditions such as headache, muscle pain, pain during periods, toothache, and joint pain.'
  },
  {
    id: "3",
    name: 'Avomine Tablet',
    mrp: 10,
    currency: 'INR',
    description: 'Avomine Tablet used in the treatment of nausea and vomiting related to certain conditions like before/after surgery or motion sickness. It may also be used to treat allergic conditions such as rash, itching, and runny nose.'
  }
]

app.get('/api/v1/medicines', (req, res) => {
  res.send(
    {
      status: 200,
      data: db,
      origin: NODE_ID
    }
  )
})

app.get('/api/v1/medicines/:id', (req, res) => {
  const medicineId = req.params['id'];
  const medicineObj = db.filter(med => med.id === medicineId)

  if (!medicineObj || medicineObj.length === 0) {
    res.status(404).send({
      status: 404,
      data: `No medicine with id ${medicineId} found in the inventory!`,
      origin: NODE_ID
    })
  }

  res.send({
    status: 200,
    data: medicineObj[0],
    origin: NODE_ID
  })
})

app.listen(PORT, () => {
  console.log(`Application ${process.env.VERSION} started on port ${PORT} as of ${new Date()}`)
  console.log(`\tUUID: ${NODE_ID}`)
})