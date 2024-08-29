import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../SudukoGame.css";

function Game() {
  const param = useParams();
  const sudokuId = param.level;
  const [initial, setInitial] = useState([]);
  const [sudokuArr, setSudokuArr] = useState([]);
  const [solved, setSolved] = useState(false);
  const [level, setLevel] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [alertShown, setAlertShown] = useState(false); // New state to track if alert has been shown

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/sudukosolver/get-sudoku-grid/${sudokuId}`
        );
        const data = await response.json();
        const { grid, difficulty, createdAt } = data;

        setInitial(grid);
        setSudokuArr(grid);
        setLevel(difficulty);

        // Calculate remaining time
        const createdTime = new Date(createdAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - createdTime) / 1000);

        const totalAllowedTime = extra(difficulty); // Time in seconds based on difficulty
        const timeLeft = totalAllowedTime - elapsedSeconds;

        if (timeLeft > 0) {
          setTimeRemaining(timeLeft);
        } else {
          handleTimeExpiry();
        }
      } catch (error) {
        console.error("Failed to fetch Sudoku:", error);
      }
    };

    fetchData();
  }, [sudokuId]);

  useEffect(() => {
    if (timeRemaining !== null && !alertShown) {
      const timerInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleTimeExpiry();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [timeRemaining, alertShown]); // Depend on alertShown to prevent multiple intervals

  function handleTimeExpiry() {
    if (!solved && !alertShown) {
      alert("Time is over! You didn't solve the Sudoku.");
      setAlertShown(true); // Mark alert as shown
      setTimeExpired(true);
      setSudokuArr(initial); // Show initial state or show the unsolved grid
    } else if (solved) {
      alert("Congratulations! You have solved the Sudoku.");
    }
    setTimeRemaining(null); // Clear timer
  }

  function padZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  function extra(Level) {
    switch (Level) {
      case "Easy":
        return 10; // 5 minutes
      case "Medium":
        return 400; // 6.67 minutes
      case "Hard":
        return 500; // 8.33 minutes
      case "Expert":
        return 700; // 11.67 minutes
      case "Insane":
        return 900; // 15 minutes
      default:
        return 300;
    }
  }

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    const val = parseInt(e.target.value) || -1;
    const grid = getDeepCopy(sudokuArr);
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    } else {
      console.log('Invalid value');
    }
    setSudokuArr(grid);
  }

  function checkRow(grid, row, num) {
    return grid[row].indexOf(num) === -1;
  }

  function checkCol(grid, col, num) {
    return grid.map((row) => row[col]).indexOf(num) === -1;
  }

  function checkBox(grid, row, col, num) {
    const rowStart = row - (row % 3);
    const colStart = col - (col % 3);
    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if (grid[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  function checkValid(grid, row, col, num) {
    return (
      checkRow(grid, row, num) &&
      checkCol(grid, col, num) &&
      checkBox(grid, row, col, num)
    );
  }

  function getNext(row, col) {
    return col !== 8 ? [row, col + 1] : row !== 8 ? [row + 1, 0] : [0, 0];
  }

  function solver(grid, row = 0, col = 0) {
    if (grid[row][col] !== -1) {
      let [newRow, newCol] = getNext(row, col);
      if (newRow === 0 && newCol === 0) {
        return true;
      }
      return solver(grid, newRow, newCol);
    }

    for (let num = 1; num <= 9; num++) {
      if (checkValid(grid, row, col, num)) {
        grid[row][col] = num;
        let [newRow, newCol] = getNext(row, col);
        if (solver(grid, newRow, newCol)) {
          return true;
        }
      }
    }
    grid[row][col] = -1;
    return false;
  }

  function compareSudokus(currentSudoku, solvedSudoku) {
    let res = {
      isComplete: true,
      inSolvable: true,
    };
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentSudoku[i][j] !== solvedSudoku[i][j]) {
          if (currentSudoku[i][j] !== -1) {
            res.inSolvable = false;
          }
          res.isComplete = false;
        }
      }
    }
    return res;
  }

  function checkSudoku() {
    let sudoku = getDeepCopy(initial);
    solver(sudoku);
    let compare = compareSudokus(sudokuArr, sudoku);

    if (compare.isComplete) {
      alert("Congratulations! You have solved the Sudoku");
      setSolved(true);
      setTimeRemaining(null); // Reset timer to hide it
    } else if (compare.inSolvable) {
      alert("Keep going");
    } else {
      alert("Sudoku can't be solved. Try again");
    }
  }

  function resetSudoku() {
    setSudokuArr(initial);
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1 className="text-4xl p-4 mt-20">
          Sudoku Solver Level (<span className="text-red-900">{level}</span>)
        </h1>
        {solved && (
          <div className="p-2">
            <span>Congratulations! Sudoku solved!</span>
          </div>
        )}
        {timeRemaining !== null && (
          <div className="text-2xl p-4">
            <span className="text-red-900">
              Time Remaining: {padZero(Math.floor(timeRemaining / 60))}:
              {padZero(timeRemaining % 60)}
            </span>
          </div>
        )}
        {timeExpired && (
          <div className="p-2">
            <span className="text-red-900">Time is over! You didn't solve the Sudoku.</span>
          </div>
        )}
        {initial.length > 0 && sudokuArr.length > 0 ? (
          <table>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rindex) => (
                <tr
                  key={rindex}
                  className={(row + 1) % 3 === 0 ? "bBorder" : ""}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cindex) => (
                    <td
                      key={cindex}
                      className={(col + 1) % 3 === 0 ? "rBorder" : ""}
                    >
                      <input
                        onChange={(e) => onInputChange(e, row, col)}
                        value={
                          sudokuArr[row][col] === -1 ? "" : sudokuArr[row][col]
                        }
                        className="cellInput"
                        disabled={initial[row][col] !== -1}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>Loading Sudoku...</div>
        )}
        <div className="buttonContainer">
          <button className="checkButton" onClick={checkSudoku}>
            Check
          </button>
          <button className="resetButton" onClick={resetSudoku}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Game;
