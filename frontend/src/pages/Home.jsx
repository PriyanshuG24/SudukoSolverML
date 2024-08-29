import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "./343773.webp"; // Import your background image

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden font-hello bg-[#a71930] px-6 py-12 ">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
        }}
      ></div>

      {/* Content Overlay */}
      <div className="relative  text-white py-24 text-center">
        <h5 className="text-6xl md:text-7xl lg:text-9xl mb-2">Sudoku Fun</h5>
        <p className="text-2xl md:text-4xl lg:text-6xl mb-8">Starts Here!</p>

        <p className="text-xl mb-4 px-4 sm:px-6 md:px-8 lg:px-12">
          “Whether You Need Sudoku Solutions or Enjoy the Game, We’ve Got All
          the Tools You Need—Explore Now!”
        </p>
        <p className="text-md mb-8 px-4 sm:px-6 md:px-8 lg:px-12">
          Discover Solutions and Tools to Elevate Your Sudoku Experience.
        </p>

        {/* Cards Section */}
        <div className="flex flex-col md:flex-row justify-center gap-6 px-4">
          <Link
            to="/gameplay"
            className="bg-white text-[#a71930] border-2 border-[#a71930] hover:bg-[#f8d7da] rounded-lg shadow-sm p-6 w-full md:w-64 lg:w-64 h-56 flex items-center justify-center transition-transform transform hover:scale-105"
          >
            <div className="text-center">
              <h6 className="text-xl md:text-lg lg:text-xl font-semibold mb-4">
                Try Gameplay
              </h6>
              <p className="text-base md:text-sm lg:text-base">
                Experience the fun of solving Sudoku puzzles with our
                interactive gameplay options.
              </p>
            </div>
          </Link>
          <Link
            to="/suduko"
            className="bg-white text-[#a71930] border-2 border-[#a71930] hover:bg-[#f8d7da] rounded-lg shadow-sm p-6 w-full md:w-64 lg:w-64 h-56 flex items-center justify-center transition-transform transform hover:scale-105"
          >
            <div className="text-center">
              <h6 className="text-xl md:text-lg lg:text-xl font-semibold mb-4">
                Get Solution
              </h6>
              <p className="text-base md:text-sm lg:text-base">
                Find quick and accurate solutions to your Sudoku puzzles with
                ease.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
