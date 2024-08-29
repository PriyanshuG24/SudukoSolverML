const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Image Schema
const imageSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, default: "uploaded" }, // 'uploaded', 'processing', 'processed'
});

// Processing Result Schema
const resultSchema = new Schema({
  imageId: { type: Schema.Types.ObjectId, ref: "Image", required: true },
  result: {
    type: [Number], // An array of arrays of numbers
    required: true,
  },
});
const sudokuSchema = new Schema({
  difficulty: {
    type: String, // For example: 'easy', 'medium', 'hard'
    required: true,
  },
  initialGrid: {
    type: [[Number]], // 9x9 grid with initial values
    required: true,
  },
  currentGrid: {
    type: [[Number]], // 9x9 grid with user updates
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);
const Result = mongoose.model("Result", resultSchema);
const Sudoku = mongoose.model("Sudoku", sudokuSchema);

module.exports = { Image, Result ,Sudoku};
