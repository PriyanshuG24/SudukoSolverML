import React, { useState,useEffect } from "react";
import backgroundImage from "./343773.webp";
import { FaRegLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Sudoku generation functions

function generateSudokuGrid(difficulty) {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillSudoku(grid);
  const cellsToRemove = getCellsToRemove(difficulty);
  removeCells(grid, cellsToRemove);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!grid[i][j]) {
        grid[i][j] = -1;
      }
    }
  }
  return grid;
}

function fillSudoku(grid) {
  const solveSudoku = (row, col) => {
    if (row === 9) return true;
    if (col === 9) return solveSudoku(row + 1, 0);
    if (grid[row][col] !== 0) return solveSudoku(row, col + 1);
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let num of numbers) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (solveSudoku(row, col + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  };
  solveSudoku(0, 0);
}

function isValid(grid, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }
  return true;
}

function removeCells(grid, numCellsToRemove) {
  let count = 0;
  while (count < numCellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      grid[row][col] = 0;
      count++;
    }
  }
}

function getCellsToRemove(difficulty) {
  const difficultyLevels = {
    Easy: 1,
    Medium: 30,
    Hard: 40,
    Expert: 50,
    Insane: 60,
  };
  return difficultyLevels[difficulty] || 30; // Default to medium if the level is not recognized
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function Gameplay() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("Easy");
  const [initial,setInitial]=useState(null)
  useEffect(() => {
    if (initial) {
      console.log(initial);
      // You can navigate to the game page here if you need
      // navigate(`/game/${difficulty}`);
    }
  }, [initial]);
  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }
  const handleStart =async () => {
    const newGrid = getDeepCopy(generateSudokuGrid(difficulty));
    setInitial(newGrid);
    try {
      const response = await fetch("http://localhost:4000/api/sudukosolver/sudoku-grid", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          initialGrid:newGrid,
          currentGrid: newGrid 
        })
      });

      if (response.ok) {
        const data = await response.json();
        const sudokuId=data._id;
        // Redirect to the Sudoku game page with the ID
        navigate(`/game/${sudokuId}`)
      } else {
        console.error('Failed to create puzzle');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleDifficultyChange = (level) => {
    setDifficulty(level);
  };

  return (
    <>
      <div className="relative overflow-hidden font-hello bg-[#a71930]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "blur(8px)",
          }}
        ></div>
        <div className="relative z-10 bg-[#a71930] bg-opacity-60 text-white py-24 text-center">
          <h5 className="text-3xl md:text-5xl lg:text-7xl mb-2">
            Play Sudoku and Test Your Skills
          </h5>
          <p className="text-xl md:text-2xl lg:text-4xl mb-8">– Let’s Go!</p>

          {/* Instructions Section */}
          <div className="text-left max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 flex items-center">
              <FaRegLightbulb className="text-yellow-300 text-3xl mr-2" /> How
              to Play
            </h2>
            <ul className="list-disc pl-6">
              <li className="mb-2">
                <strong>Understand the Basics:</strong> Each row, column, and
                3x3 grid must contain the numbers 1 through 9 without
                repetition.
              </li>
              <li className="mb-2">
                <strong>Use Process of Elimination:</strong> Fill in cells where
                only one number is possible based on existing clues.
              </li>
              <li className="mb-2">
                <strong>Look for Patterns:</strong> Identify patterns like pairs
                and triplets to simplify your solving process.
              </li>
              <li className="mb-2">
                <strong>Keep Track of Possible Numbers:</strong> Use pencil
                marks to note potential numbers for each cell.
              </li>
              <li className="mb-2">
                <strong>Stay Systematic:</strong> Work methodically through
                rows, columns, and grids.
              </li>
            </ul>
          </div>

          {/* Sudoku Game Section */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 bg-opacity-80 text-center text-white">
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6">
              Choose Your Difficulty Level
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              <button
                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded text-xs md:text-base"
                onClick={() => handleDifficultyChange("Easy")}
              >
                Easy
              </button>
              <button
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded text-xs md:text-base"
                onClick={() => handleDifficultyChange("Medium")}
              >
                Medium
              </button>
              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded text-xs md:text-base"
                onClick={() => handleDifficultyChange("Hard")}
              >
                Hard
              </button>
              <button
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded text-xs md:text-base"
                onClick={() => handleDifficultyChange("Expert")}
              >
                Expert
              </button>
              <button
                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded text-xs md:text-base"
                onClick={() => handleDifficultyChange("Insane")}
              >
                Insane
              </button>
            </div>
            <p className="text-md md:text-xl lg:text-2xl mt-6">
              Selected Difficulty: {difficulty}
            </p>
            <button
              className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-2 px-4 rounded text-base md:text-lg"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gameplay;
