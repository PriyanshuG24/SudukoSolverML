const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    solvedSudko,
    uploadSuduko,
    processSuduko,
    sudokuGrid,
    getSudokuGrid
} = require('../controllers/sudukoSolverControllers');

// Resolve the absolute path to the 'IMAGES' directory
const absolutePath = path.resolve(__dirname, '../IMAGES');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, absolutePath); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name
  },
});

const upload = multer({ storage });
// Get Processing Results API
router.get('/results/:id',solvedSudko)

// Image Upload API
router.post('/upload',upload.single('image'),uploadSuduko)

// Trigger Image Processing API
router.post('/process-image',processSuduko)

//saving the sudoku grid
router.post('/sudoku-grid',sudokuGrid)

//get the sudoku grid
router.get('/get-sudoku-grid/:id',getSudokuGrid)

module.exports = router;