const { Router } = require('express')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../utils')
const YooKassa = require('yookassa')
const dotenv = require('dotenv')

dotenv.config()

const router = Router()

const yooKassa = new YooKassa({
   shopId: '892740',
   secretKey: `${process.env.YOO_SEC}`
})

//CREATE

router.post('/create', verifyToken, async (req, res) => {
   const newOrder = new Order({
      user: req.user.id,
      products: req.body.products,
      fullName: req.body.fullName,
      phone: req.body.phone,
      city: req.body.city,
      address: req.body.address,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      isPaid: req.body.paymentMethod === 'card',
   })

   try {
      const asyncSome = async (arr, predicate) => {
         for (let e of arr) {
            if (await predicate(e)) return true
         }
         return false
      };

      const flag = await asyncSome(newOrder.products, async (product) => {
         return product.quantity > (await Product.findById(product.product)).countInStock
      })

      if (flag) {
         return res.status(400).json({ message: 'Product out of stock' })
      } else {
         for (const item of newOrder.products) {
            const product = await Product.findById(item.product)
            await Product.findByIdAndUpdate(
               item.product,
               {
                  $set: {
                     countInStock: product.countInStock - item.quantity
                  },
               }
            )
         }
      }

      if (newOrder.paymentMethod === 'card') {
         await yooKassa.createPayment({
            amount: {
               value: `${newOrder.amount}`,
               currency: 'RUB'
            },
            payment_token: req.body.paymentToken,
            confirmation: {
               type: 'redirect',
               return_url: 'https://www.merchant-website.com/return_url'
            },
            capture: false
         }).then(async (resolve) => {
            newOrder.paidAt = Date.now()
            await newOrder.save()
            res.status(200).json('Order has been created')
         }).catch((err) => {
            res.status(400).json(err)
         })
      } else {
         await newOrder.save()
         res.status(200).json('Order has been created')
      }
   } catch (err) {
      res.status(500).json(err)
   }
})

//UPDATE

router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
      if (order) {
         if (!order.isDelivered && req.body.isDelivered) {
            order.deliveredAt = Date.now()
         }

         Object.assign(order, req.body)
         await order.save()
         res.status(200).json({ message: 'Order has been updated!' })
      } else {
         res.status(400).json({ message: 'Order not found' })
      }
   } catch (err) {
      res.status(500).json(err)
   }
})

//DELETE

router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
      for (const item of order.products) {
         const product = await Product.findById(item.product)
         await Product.findByIdAndUpdate(
            item.product,
            {
               $set: {
                  countInStock: product.countInStock + item.quantity
               }
            }
         )
      }

      await order.deleteOne()
      res.status(200).json({ message: 'Order has been deleted...' })
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET USER ORDERS

router.get('/user/:id', verifyTokenAndAuthorization, async (req, res) => {
   try {
      const orders = await Order.find({ user: req.params.id }).sort({ createdAt: 'desc' })
      res.status(200).json(orders)
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET ORDER

router.get('/:id', verifyToken, async (req, res) => {
   try {
      const order = await Order.findById(req.params.id)
      res.status(200).json(order)
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET ALL ORDERS

router.get('/', verifyTokenAndAdmin, async (req, res) => {
   try {
      const orders = await Order.find()
      res.status(200).json(orders)
   } catch (err) {
      res.status(500).json(err)
   }
})

module.exports = router