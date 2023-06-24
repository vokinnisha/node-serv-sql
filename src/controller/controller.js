const router = require('../routes/route.js')
const express = require('express')
const cors = require('cors')


const app = express()

app.use(express.json())
app.use(cors())


app.use('/person_db', router)

module.exports = app