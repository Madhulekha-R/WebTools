import React, { useState, useRef } from "react";
import "./WordCompressionTool.css";

const WordCompressionTool = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetSize, setTargetSize] = useState("1"); // Target size in MB
  const [downloading, setDownloading] = useState(false);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOriginalSize((file.size / (1024 * 1024)).toFixed(2));
      setCompressedSize(null);
    }
  };

  const handleCompress = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setDownloading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("targetSize", targetSize);

    try {
      const response = await fetch("http://localhost:5000/api/convert/compress-word", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setCompressedSize((blob.size / (1024 * 1024)).toFixed(2));

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `compressed-${selectedFile.name.replace(/\.(doc|docx)$/i, '.pdf')}`;
        link.click();
      } else {
        const errorData = await response.json();
        alert(errorData?.error || "Failed to compress Word document.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="compression-tool-panel">
      <h2 className="compression-tool-heading">Word Compression</h2>
      <div className="compression-tool-description">
        Upload your DOC or DOCX file and specify target size. Output will be a compressed PDF.
      </div>
      <form className="compression-tool-form" onSubmit={handleCompress}>
        <label
          className={`custom-file-label${selectedFile ? " selected" : ""}`}
          htmlFor="file-upload"
        >
          <span>
            {selectedFile
              ? `✔ ${selectedFile.name} (${originalSize} MB)`
              : "Choose Word File"}
          </span>
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div className="size-input-group">
          <label htmlFor="target-size">Target Size (MB):</label>
          <input
            id="target-size"
            type="number"
            min="0.1"
            step="0.1"
            value={targetSize}
            onChange={(e) => setTargetSize(e.target.value)}
            className="size-input"
          />
        </div>

        {compressedSize && (
          <div className="size-comparison">
            <p>Original: {originalSize} MB → Compressed: {compressedSize} MB</p>
            <p className="savings">Saved: {(originalSize - compressedSize).toFixed(2)} MB ({((1 - compressedSize / originalSize) * 100).toFixed(1)}%)</p>
          </div>
        )}

        <button type="submit" disabled={!selectedFile || downloading}>
          {downloading ? "Compressing..." : "Compress & Download"}
        </button>
      </form>
    </div>
  );
};

export default WordCompressionTool;
