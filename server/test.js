const mongoose = require("mongoose");
const schema = new mongoose.Schema({ floor: { type: String, required: true } });
const Model = mongoose.model("Test", schema);
const doc = new Model({ floor: "" });
const err = doc.validateSync();
console.log(err ? err.message : "Valid");
