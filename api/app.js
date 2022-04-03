const express = require('express')
const fs = require('fs')
const http = require('http')
const https = require('https')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const orderRoute = require('./routes/order')
const path = require('path')

dotenv.config()

const cert = fs.readFileSync('cert.pem')
const key = fs.readFileSync('key.pem')

const app = express()

app.use(cors())

app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)

if (process.env.NODE_ENV === 'PRODUCTION') {
   app.use('/', express.static(path.join(__dirname, '../client/build')))

   app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'))
   })
}

async function start() {
   try {
      await mongoose.connect(process.env.MONGO_URL)
         .then(() => console.log('DB Connection Successfull!'))
         .catch((err) => {
            console.log(err)
         })

      https.createServer({ key, cert }, app)
         .listen(process.env.HTTPS_PORT,
            () => console.log(`App has been started on port ${process.env.HTTPS_PORT}...`)
      )

      http.createServer(function (req, res) {
         res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url })
         res.end()
      }).listen(process.env.HTTP_PORT,
         () => console.log(`App has been started on port ${process.env.HTTP_PORT}...`)
      )
   } catch (e) {
      console.log('Server Error', e.message)
      process.exit(1)
   }
}

start()