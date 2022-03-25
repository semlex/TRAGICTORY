const { Router } = require('express')
const Product = require('../models/Product')
const { verifyToken, verifyTokenAndAdmin } = require('../utils')

const router = Router()

//CREATE

router.post('/create', verifyTokenAndAdmin, async (req, res) => {
   const newProduct = new Product(req.body);

   try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct)
   } catch (err) {
      res.status(500).json(err)
   }
})

//UPDATE

router.put('/update/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const updatedProduct = await Product.findByIdAndUpdate(
         req.params.id,
         {
            $set: req.body,
         }
      )
      res.status(200).json(updatedProduct)
   } catch (err) {
      res.status(500).json(err)
   }
})


//DELETE

router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      await Product.findByIdAndDelete(req.params.id)
      res.status(200).json({ message: 'Product has been deleted...' })
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET FILTERS

router.get('/filters', async (req, res) => {
   const qCategory = req.query.category
   const qSearch = req.query.search
   try {
      let filter = {}

      if (qCategory) {
         filter.category = { $in: [qCategory] }
      }

      if (qSearch) {
         filter.title = { $regex: new RegExp(qSearch), $options: 'i' }
      }

      const sizes = await Product.distinct('size', filter).sort()
      const brands = await Product.distinct('brand', filter).sort()
      const min_price = Math.floor(Math.min(...await Product.distinct('price', filter)) / 1000) * 1000
      const max_price = Math.ceil(Math.max(...await Product.distinct('price', filter)) / 1000) * 1000
      const filters = {
         sizes: sizes.map((item) => ({ title: item, value: item })),
         brands: brands.map((item) => ({ title: item, value: item })),
         min_price,
         max_price
      }
      res.status(200).json(filters)
   } catch (err) {
      res.status(500).json(err)
   }
})

//POST FEEDBACK

router.post('/feedback/:id', verifyToken, async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      if (product) {
         if (!req.body.name) {
            return res.status(400).send({ message: 'Enter name' })
         }

         if (!req.body.comment) {
            return res.status(400).send({ message: 'Enter comment' })
         }

         const feedback = {
            name: req.body.name,
            comment: req.body.comment
         }

         product.feedbacks.push(feedback)
         const updatedProduct = await product.save()

         res.status(201).send(updatedProduct.feedbacks[updatedProduct.feedbacks.length - 1])
      } else {
         res.status(400).send({ message: 'Product not found' })
      }
   } catch (err) {
      res.status(500).json(err)
   }
})

//DELETE FEEDBACK

router.post('/feedback/delete/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      if (product) {
         if (!req.body.feedbackId) {
            return res.status(400).send({ message: 'Need a feedback ID' })
         }

         if (!product.feedbacks.find(elem => elem._id.toString() === req.body.feedbackId)) {
            return res.status(400).send({ message: 'Feedback with this ID does not exists...' })
         }

         product.feedbacks = product.feedbacks.filter(elem => elem._id.toString() !== req.body.feedbackId)
         await product.save()

         res.status(201).send({ message: 'Feedback has been deleted' })
      } else {
         res.status(400).send({ message: 'Product not found' })
      }
   } catch (err) {
      res.status(500).json(err)
   }
})

//SEARCH PRODUCTS

router.get('/search/:term', async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      res.status(200).json(product)
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET POPULAR

router.get('/popular', async (req, res) => {
   try {
      const filter = { countInStock: { $gt: 0 } }

      const products = await Product.find(filter).limit(32)

      res.status(200).json(products)
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET PRODUCT

router.get('/:id', async (req, res) => {
   try {
      const product = await Product.findById(req.params.id)
      res.status(200).json(product)
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET ALL PRODUCTS

router.get('/', async (req, res) => {
   const qCategory = req.query.category
   const qSearch = req.query.search
   try {
      let products
      let filter = {}

      if (qCategory) {
         filter.category = { $in: [qCategory] }
      }

      if (qSearch) {
         filter.title = { $regex: new RegExp(qSearch), $options: 'i' }
      }

      products = await Product.find(filter)

      const categories = await Product.distinct('category', filter).sort()

      res.status(200).json({ products, categories })
   } catch (err) {
      res.status(500).json(err)
   }
})

module.exports = router