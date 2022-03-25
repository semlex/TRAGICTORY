const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const orderRoute = require('./routes/order')
const path = require('path')

dotenv.config()

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

      app.listen(process.env.PORT || 5000,
         () => console.log(`App has been started on port ${process.env.PORT}...`)
      )
   } catch (e) {
      console.log('Server Error', e.message)
      process.exit(1)
   }
}

start()