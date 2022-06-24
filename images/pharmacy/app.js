const express = require('express')
const PORT = process.env.PORT || 80

const app = express()

const uuid = require('uuid')
const NODE_ID = uuid.v4()

const db = [
  {
    id: "PH00001",
    name: "Global Pharmacy",
    location: "Area 120",
    inventory: [
      {
        medicineId: "1",
        stock: 10
      }, {
        medicineId: "3",
        stock: 10
      }
    ]
  },
  {
    id: "PH00002",
    name: "Regional Pharmacy",
    location: "Area 540",
    inventory: [
      {
        medicineId: "1",
        stock: 5
      }, {
        medicineId: "2",
        stock: 40
      }
    ]
  }
]

app.get('/api/v1/pharmacies', async (req, res) => {
  let medicineData = await getAllMedicines()
  let pharmacies = JSON.parse(JSON.stringify(db))
  
  let pharmaciesWithInventoryValue = pharmacies.map(
    pharmacy => {
      pharmacy.inventoryValue = pharmacy.inventory.map(
        inventory => {
          let medicine = medicineData[inventory.medicineId]
          return inventory.stock * medicine.mrp
        }
      ).reduce((a, b) => a + b)
      
      return pharmacy
    }
  )

  res.send({
    status: 200,
    origin: NODE_ID,
    data: pharmaciesWithInventoryValue
  })
})

async function getAllMedicines () {
  const response = await fetch(`http://localhost:8081/api/v1/medicines`)
  const payload = await response.json()
  
  // convert array to map
  let result = {}
  payload.data.forEach(medicine => result[medicine.id] = medicine)
  
  return result
}

app.listen(PORT, () => {
  console.log(`Application ${process.env.VERSION} started on port ${PORT} as of ${new Date()}`)
  console.log(`\tUUID: ${NODE_ID}`)
})