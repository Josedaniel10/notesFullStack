const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const uri = process.env.MONGODB_URI;


mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err))

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema);