import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../SudukoGame.css";

const Solution = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const [localSolution, setLocalSolution] = useState(Array(9).fill(Array(9).fill(-1)));
  const [unsolvedGrid, setUnsolvedGrid] = useState(Array(9).fill(Array(9).fill(-1)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNewUpload = () => {
    navigate('/suduko');
  };

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
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

  useEffect(() => {
    const fetchSolution = async () => {
      if (!imageId) return; // Prevent fetching if no imageId

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:4000/api/sudukosolver/results/${imageId}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const matrix = [];
        const unsolvedMatrix = [];
        for (let i = 0; i < 9; i++) {
          const row = data.result
            .slice(i * 9, i * 9 + 9)
            .map((cell) => (cell === 0 ? -1 : cell));
          matrix.push(row);
          unsolvedMatrix.push(row.map(cell => (cell === -1 ? -1 : cell))); // Create unsolved matrix
        }
        const suduko = getDeepCopy(matrix);
        solver(suduko);
        setLocalSolution(suduko);
        setUnsolvedGrid(unsolvedMatrix);
      } catch (error) {
        setError(`Error fetching solution: ${error.message}`);
        console.error("Error fetching solution:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSolution();
  }, [imageId]); // Re-run only if imageId changes

  if (loading) {
    return <p className="text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-4 text-lg">{error}</p>;
  }
  return (
    <>
      <div className="App">
        <div className="App-header">
          <h1 className="text-5xl p-4 mt-20">Sudoku Solution</h1>
          <table>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rindex) => (
                <tr
                  key={rindex}
                  className={(rindex + 1) % 3 === 0 ? "bBorder" : ""}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cindex) => (
                    <td
                      key={cindex}
                      className={(cindex + 1) % 3 === 0 ? "rBorder" : ""}
                      
                    >
                      <input
                        value={
                          localSolution[row][col] === -1
                            ? ""
                            : localSolution[row][col]
                        }
                        className="cellInput"
                        style={{
                          backgroundColor:
                            unsolvedGrid[row][col] !== -1 ? "#c9baba" : "white", // Apply color based on unsolved value
                        }}
                        readOnly
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <section className="mt-8 text-center px-4 py-4">
            <button
              onClick={handleNewUpload}
              className="bg-[#a71930] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#a71930]/80 transition-colors text-base sm:text-lg"
            >
              Upload New Image
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default Solution;
