const { Schema, model } = require('mongoose')

const FeedbackSchema = new Schema(
   {
      name: { type: String, required: true },
      comment: { type: String, required: true }
   },
   { timestamps: true }
)

const ProductSchema = new Schema(
   {
      title: { type: String, required: true, unique: true },
      brand: { type: String, required: true },
      category: { type: String, required: true },
      size: { type: String, required: true },
      desc: { type: String, required: true, },
      img: { type: String, required: true },
      price: { type: Number, required: true },
      countInStock: { type: Number, min: 0, required: true },
      feedbacks: [ FeedbackSchema ]
   },
   { timestamps: true }
);

module.exports = model('Product', ProductSchema)