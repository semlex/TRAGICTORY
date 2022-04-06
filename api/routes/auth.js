const { Router } = require('express')
const { AES, enc } = require('crypto-js')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')

const router = Router()

//REGISTER

router.post('/register',
   [
      check('email', 'Incorrect email').isEmail(),
      check('password', 'Minimum password length is 6 characters ')
         .isLength({ min: 6 }),
      check('confirmPassword', 'Minimum password length is 6 characters ')
         .isLength({ min: 6 }),
      check('name', 'Enter name').exists(),
      check('surname', 'Enter surname').exists()
   ],
   async (req, res) => {
      try {
         const errors = validationResult(req)

         if (!errors.isEmpty()) {
            return res.status(400).json({
               errors: errors.array(),
               message: 'Incorrect data'
            })
         }

         const { name, surname, email, password, confirmPassword } = req.body

         const candidate = await User.findOne({ email })

         if (candidate) {
            return res.status(400).json({ message: 'User already exists' })
         }

         if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords does not match' })
         }

         const hashedPassword = AES.encrypt(
            password,
            process.env.PASS_SEC
         ).toString()

         const newUser = new User({ name, surname, email, password: hashedPassword })

         await newUser.save()

         const accessToken = jwt.sign(
            {
               id: newUser._id,
               isAdmin: newUser.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:'3d'}
         )

         res.status(200).json({
            userId: newUser.id,
            name: newUser.name,
            surname: newUser.surname,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            accessToken
         })

      } catch (e) {
         res.status(500).json({ message: 'Something went wrong, please try again...' })
      }
})

//LOGIN

router.post('/login',
   [
      check('email', 'Enter correct email').normalizeEmail().isEmail(),
      check('password', 'Enter password').exists()
   ],
   async (req, res) => {
   try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({
            errors: errors.array(),
            message: 'Incorrect login data'
         })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
         return res.status(400).json({ message: 'Wrong email or password' })
      }

      const hashedPassword = AES.decrypt(
         user.password,
         process.env.PASS_SEC
      )


      const originalPassword = hashedPassword.toString(enc.Utf8)

      if (originalPassword !== password) {
         return res.status(401).json({ message: 'Wrong email or password' })
      }

      const accessToken = jwt.sign(
         {
            id: user._id,
            isAdmin: user.isAdmin,
         },
         process.env.JWT_SEC,
         {expiresIn:'3d'}
      )

      res.status(200).json({
         userId: user.id,
         name: user.name,
         surname: user.surname,
         email: user.email,
         isAdmin: user.isAdmin,
         accessToken
      })

   } catch (e) {
      res.status(500).json({ message: 'Something went wrong, please try again...' })
   }
})

module.exports = router