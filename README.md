
# Sudoku Solver with Machine Learning
## Overview

Sudoku Solver is a web application designed to solve Sudoku puzzles using advanced machine learning techniques. This project allows users to upload Sudoku grids, process them, and receive solutions. Built with React for the frontend and Node.js for the backend, the application integrates machine learning to provide accurate solutions for various difficulty levels.


## Features

- Sudoku Puzzle Upload: Upload Sudoku puzzles in image format.
- Automated Solution: Use machine learning to solve the Sudoku puzzle.
- Interactive Grid: View and edit Sudoku grids even after solving.
- Timer Functionality: Track the time taken to solve puzzles.
- Difficulty Levels: Generate and solve puzzles of different difficulty levels.


## Installation

Install my-project with npm
### frontend
```bash
  git clone https://github.com/PriyanshuG24/SudokuSolverML.git
  cd SudokuSolverML/frontend
  npm install
  npm start
```

### backend
```bash
  cd SudokuSolverML/backend
  npm install
  MONGODB_URI=your_mongodb_connection_string
  npm run dev
```
    
## Usage
### Upload a Sudoku puzzle:

- Navigate to the upload page on the frontend.
- Upload an image of the Sudoku puzzle.
### View Solution:

- The puzzle will be processed, and the solution will be displayed on the screen.
### Edit Grid:

- Users can edit the Sudoku grid even after solving, if the cell was originally empty.
### Timer:

- A timer will track the time taken to solve the puzzle, showing the elapsed time and the result.


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

### Contributions to the project are welcome! Please follow these guidelines:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them.
- Push your changes to your forked repository.
- Submit a pull request with a clear description of your changes.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/)


## Acknowledgements

 - [For building the frontend](https://react.dev/)
 - [For backend development](https://nodejs.org/en/)
 - [For solving Sudoku puzzles](https://www.tensorflow.org/js)

