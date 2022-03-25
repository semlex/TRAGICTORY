const { Router } = require('express')
const { AES, enc} = require('crypto-js')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../utils')
const User = require('../models/User')

const router = Router()


//UPDATE

router.put('/update/:id', verifyTokenAndAuthorization, async (req, res) => {
   if (req.body.email) {
      return res.status(403).json({ message: 'You can\'t change email' })
   }

   if (req.body.password) {
      if (!req.body.oldPassword) {
         return res.status(400).json({ message: 'Enter old password' })
      }

      const hashedPassword = AES.decrypt(
         (await User.findById(req.params.id)).password,
         process.env.PASS_SEC
      )

      const originalPassword = hashedPassword.toString(enc.Utf8)

      if (originalPassword !== req.body.oldPassword) {
         return res.status(400).json({ message: 'Wrong old password' })
      }

      if (req.body.password !== req.body.confirmPassword) {
         return res.status(400).json({ message: 'Passwords don\'t match' })
      }

      req.body.password = AES.encrypt(
         req.body.password,
         process.env.PASS_SEC
      ).toString()
   }

   try {
      const updatedUser = await User.findByIdAndUpdate(
         req.params.id,
         {
            $set: req.body,
         },
         { new: true }
      )

      res.status(200).json({
         userId: updatedUser.id,
         name: updatedUser.name,
         surname: updatedUser.surname,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin,
      })
   } catch (err) {
      res.status(500).json(err);
   }
})

//DELETE

router.delete('/delete/:id', verifyTokenAndAuthorization, async (req, res) => {
   try {
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json({ message: 'User has been deleted...' })
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET USER

router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
   try {
      const user = await User.findById(req.params.id)
      res.status(200).json({
         userId: user.id,
         name: user.name,
         surname: user.surname,
         email: user.email,
         isAdmin: user.isAdmin
      })
   } catch (err) {
      res.status(500).json(err)
   }
})

//GET ALL USERS

router.get('/', verifyTokenAndAdmin, async (req, res) => {
   try {
      const users = await User.find()
      res.status(200).json(users)
   } catch (err) {
      res.status(500).json(err)
   }
})

module.exports = router