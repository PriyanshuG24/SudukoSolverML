import React, { useState } from "react";
import backgroundImage from "./343773.webp"; // Update this path to your image
import { Grid } from "react-loader-spinner"; // Import Grid component from the loader spinner library
import { FaCheckCircle, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sudoku = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageId, setImageId] = useState("");
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploadedImage, setUploadedImage] = useState(""); // Added for image preview

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadedImage(URL.createObjectURL(event.target.files[0])); // Set image URL for preview
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatus("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true); // Start loading
    setStatus("Uploading image...");

    try {
      const response = await fetch("http://localhost:4000/api/sudukosolver/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setImageId(data.imageId);
      setStatus("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setStatus("Error uploading image");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleProcess = async () => {
    if (!imageId) {
      setStatus("No image ID available for processing.");
      return;
    }

    setLoading(true); // Start loading
    setStatus("Processing image...");

    try {
      const response = await fetch("http://localhost:4000/api/sudukosolver/process-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSolution(data.newResult.result);
      setStatus("Processing complete.");
      navigate(`/solution/${imageId}`); // Navigate to solution page
    } catch (error) {
      console.error("Error processing image:", error);
      setStatus("Error processing image");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleNewUpload = () => {
    setFile(null);
    setImageId("");
    setSolution(null);
    setStatus("");
    setUploadedImage(""); // Clear image preview
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-hello bg-[#a71930] px-6 py-12">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
        }}
      ></div>
      {/* Content Wrapper */}
      <div className="relative z-10 bg-opacity-60">
        {/* Header Section */}
        <header className="text-center mb-24 mt-24">
          <h1 className="text-7xl font-bold text-white">Sudoku Solution</h1>
          <p className="text-lg text-white">
            Upload your Sudoku puzzle image to get the solution.
          </p>
        </header>
        {/* Instructions Section */}
        <section className="max-w-6xl mx-auto mb-8 text-gray-200 relative">
          <h2 className="text-2xl font-semibold mb-4">Image Upload Instructions</h2>
          <p className="text-lg">
            Please upload a clear image of the Sudoku puzzle. The image should be:
          </p>
          <ul className="list-disc list-inside text-lg mt-2 space-y-2">
            <li className="flex items-center p-2 border-l-4 border-green-400 bg-opacity-70 bg-gray-800 backdrop-blur-md rounded-lg">
              <FaCheckCircle className="text-green-300 mr-2" />
              In focus with high resolution.
            </li>
            <li className="flex items-center p-2 border-l-4 border-green-400 bg-opacity-70 bg-gray-800 backdrop-blur-md rounded-lg">
              <FaCheckCircle className="text-green-300 mr-2" />
              Containing the entire Sudoku grid.
            </li>
            <li className="flex items-center p-2 border-l-4 border-green-400 bg-opacity-70 bg-gray-800 backdrop-blur-md rounded-lg">
              <FaCheckCircle className="text-green-300 mr-2" />
              Free from distortions or obstructions.
            </li>
          </ul>
        </section>

        {/* Upload Section */}
        <main className="max-w-6xl mx-auto bg-white p-8 rounded-lg border border-gray-200 shadow-lg relative z-10">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#a71930] flex items-center">
              <FaCloudUploadAlt className="mr-2" /> Upload Your Puzzle Image
            </h2>
            <form onSubmit={handleUpload} className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-400 rounded-lg p-3 mb-4 w-full text-[#a71930] bg-gray-50 hover:bg-gray-100 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#a71930] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#a71930]/80 transition-colors"
              >
                Upload
              </button>
              {loading && status === "Uploading image..." && (
                <div className="absolute w-auto flex items-center justify-center space-x-4">
                  <Grid
                    visible={true}
                    height="40"
                    width="40"
                    color="#a71930"
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass="grid-wrapper"
                  />
                  <p className="text-center text-[#a71930]">Uploading...</p>
                </div>
              )}
            </form>
          </section>

          {/* Processing Section */}
          {imageId && (
            <section className="mb-8">
              <button
                onClick={handleProcess}
                className="bg-[#a71930] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#a71930]/80 transition-colors"
                disabled={loading}
              >
                Process Image
              </button>
            </section>
          )}

          <section className="mb-8">
            {loading && status === "Processing image..." && (
              <div className="relative flex items-center justify-center space-x-4">
                <Grid
                  visible={true}
                  height="40"
                  width="40"
                  color="#a71930"
                  ariaLabel="grid-loading"
                  radius="12.5"
                  wrapperStyle={{}}
                  wrapperClass="grid-wrapper"
                />
                <p className="text-center text-[#a71930]">Processing...</p>
              </div>
            )}
            {status && !loading && (
              <p className="text-center text-[#a71930]">{status}</p>
            )}
          </section>

          {/* Solution Display Section */}
          {solution && (
            <section className="mt-8 text-center">
              <button
                onClick={handleNewUpload}
                className="bg-[#a71930] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#a71930]/80 transition-colors"
              >
                Upload New Image
              </button>
            </section>
          )}
          {!solution && !loading && !imageId && (
            <section className="mt-8 text-center">
              <p className="text-[#a71930]">
                No solution available. Please upload an image to get the
                solution.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sudoku;
