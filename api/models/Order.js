const { Schema, model } = require('mongoose')

const OrderSchema = new Schema(
   {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      products: [
         {
            product: {
               type: Schema.Types.ObjectId,
               ref: 'Product',
               required: true,
            },
            quantity: {
               type: Number,
               default: 1,
               required: true
            },
            img: { type: String, required: true},
            title: { type: String, required: true },
            price: { type: Number, required: true }
         },
      ],
      fullName : { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      amount: { type: Number, required: true },
      paymentMethod: { type: String, required: true },
      isPaid: { type: Boolean, default: false },
      paidAt: { type: Date },
      isDelivered: { type: Boolean, default: false },
      deliveredAt : { type: Date }
   },
   { timestamps: true }
)

module.exports = model('Order', OrderSchema)