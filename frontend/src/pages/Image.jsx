import React, { useState } from 'react';

function Image() {
  const [file, setFile] = useState(null);
  const [imageId, setImageId] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:4000/api/sudukosolver/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setImageId(data.imageId);
      setStatus('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setStatus('Error uploading image');
    }
  };

  const handleProcess = async () => {
    if (!imageId) {
      setStatus('No image ID available for processing.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/sudukosolver/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResult(data.result);
      console.log(data)
      setStatus('Processing complete.');
    } catch (error) {
      console.error('Error processing image:', error);
      setStatus('Error processing image');
    }
  };

  const renderGrid = () => {
    if (!result) return null;

    // Convert the single array into a 9x9 grid
    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(result.slice(i * 9, i * 9 + 9));
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 30px)', gap: '10px' }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ccc',
              }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Image</button>
      </form>
      <h1>{imageId}</h1>
      <button onClick={handleProcess} disabled={!imageId}>
        Process Image
      </button>
      <p>Status: {status}</p>
      {renderGrid()}
    </div>
  );
}

export default Image;
