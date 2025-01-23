"use client";  // This tells Next.js it's a Client Component

import React, { useState } from "react";

const SelectedFile = () => {
  const [file, setFile] = useState<File | null>(null);  // TypeScript update for file state
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Optional chaining to check if files exist
    if (selectedFile && selectedFile.size < 5 * 1024 * 1024) {
      setFile(selectedFile);
      setError("");
      setSuccess("File selected successfully!");
    } else {
      setFile(null);
      setError("File size should be less than 5MB");
      setSuccess("");
    }
  };

  const handleUpload = () => {
    if (file) {
      // Simulate file upload
      setTimeout(() => {
        setSuccess("File uploaded successfully!");
        setFile(null);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 p-6 text-white text-center">
        <h1 className="text-3xl font-bold">AI-Powered Medical Business Tool</h1>
        <p className="mt-2 text-lg">Upload and analyze medical documents easily with our AI tool!</p>
      </header>

      {/* File Upload Section */}
      <div className="flex flex-col items-center justify-center flex-grow bg-gray-100 py-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Upload a File</h2>

          {/* File Input */}
          <label
            htmlFor="file-upload"
            className="block bg-blue-600 text-white text-center py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.png,.pdf,.docx"
            />
            Choose a file
          </label>

          {file && <p className="mt-3 text-sm text-gray-700 font-semibold">Selected File: {file.name}</p>}
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          {success && <p className="mt-2 text-green-500 text-sm">{success}</p>}

          {/* Upload Button */}
          <button
            className={`mt-5 w-full py-2 px-4 rounded-lg text-white ${file ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"} transition-colors`}
            onClick={handleUpload}
            disabled={!file}
          >
            {file ? "Upload File" : "Choose a file first"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 p-6 text-white text-center">
        <p className="text-sm">
          Powered by AI for the future of medical businesses. © 2024 AI Medical Tools.
        </p>
      </footer>
    </div>
  );
};

export default SelectedFile;
