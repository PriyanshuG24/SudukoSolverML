const { Image, Result, Sudoku } = require("../models/sudukoSolverModels");
const mongoose = require("mongoose");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const solvedSudko = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameters

  if (!id) {
    return res.status(400).json({ error: "ID parameter is required" });
  }

  try {
    // Fetch the result by imageId
    const result = await Result.findOne({ imageId: id });

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    // Send the result back to the client
    return res.status(200).json({ result: result.result });
  } catch (error) {
    console.error("Error fetching result:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const uploadSuduko = async (req, res) => {
  try {
    const newImage = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
    const savedImage = await newImage.save();
    res.status(200).json({ imageId: savedImage._id });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

const processSuduko = async (req, res) => {
  const imageId = req.body.imageId;

  try {
    // Find the image document by ID
    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ error: "Image not found" });

    // Update image status to 'processing'
    image.status = "processing";
    await image.save();

    // Define the path to your Python script
    const pythonScriptPath = path.join(
      __dirname,
      "..",
      "..",
      "venv",
      "main.py"
    );
    const imagePath = path.join(__dirname, "..", "IMAGES", image.filename);

    // Execute the Python script with the image path
    exec(`python ${pythonScriptPath} ${imagePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing Python script:", error);
        return res.status(500).json({ error: "Failed to process image" });
      }

      // Parse the output from the Python script (assumed to be JSON)
      let result;
      try {
        result = JSON.parse(stdout);
      } catch (parseError) {
        console.error("Error parsing Python script output:", parseError);
        return res
          .status(500)
          .json({ error: "Failed to parse Python script output" });
      }

      // Save the result to the Result collection
      const newResult = new Result({
        imageId: image._id,
        result: result.solution, // Save the 9x9 matrix here
      });

      newResult
        .save()
        .then(() => {
          // Update image status to 'processed'
          image.status = "processed";
          return image.save();
        })
        .then(() => {
          // Delete the image file
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image file:", err);
            }
          });
          // Send response with the processed result
          res.status(200).json({ message: "Processing complete", newResult });
        })
        .catch((saveError) => {
          console.error("Error saving result:", saveError);
          res.status(500).json({ error: "Failed to save result" });
        });
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
};

const sudokuGrid = async (req, res) => {
  try {
    const { difficulty, initialGrid, currentGrid } = req.body;
    const newSudoku = new Sudoku({
      difficulty,
      initialGrid,
      currentGrid,
    });
    const savedSudoku = await newSudoku.save();
    return res.status(201).json(savedSudoku);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create puzzle" });
  }
};

const getSudokuGrid = async (req, res) => {
  const { id } = req.params;
  try {
    const sudoku = await Sudoku.findById(id);
    return res.status(200).json({
      grid: sudoku.currentGrid,
      difficulty: sudoku.difficulty,
      createdAt:sudoku.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Sudoku" });
  }
};

module.exports = {
  solvedSudko,
  uploadSuduko,
  processSuduko,
  sudokuGrid,
  getSudokuGrid,
};
