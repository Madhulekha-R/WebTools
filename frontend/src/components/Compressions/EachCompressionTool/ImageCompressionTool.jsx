import React, { useState, useRef } from "react";
import { API_BASE_URL } from '../../../config/api';
import "./ImageCompressionTool.css";

const ImageCompressionTool = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [targetSize, setTargetSize] = useState("1"); // Target size in MB
    const [downloading, setDownloading] = useState(false);
    const [originalSize, setOriginalSize] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setOriginalSize((file.size / (1024 * 1024)).toFixed(2)); // Convert to MB
            setCompressedSize(null);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleCompress = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        setDownloading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("targetSize", targetSize); // Send target size to backend

        try {
            const response = await fetch(`${API_BASE_URL}/api/convert/compress-image`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                setCompressedSize((blob.size / (1024 * 1024)).toFixed(2));

                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                const fileExtension = selectedFile.name.split('.').pop();
                link.download = `compressed-${selectedFile.name.replace(`.${fileExtension}`, '')}.${fileExtension}`;
                link.click();
            } else {
                const errorData = await response.json();
                alert(errorData?.error || "Failed to compress image.");
            }
        } catch (err) {
            alert("Server error: " + err.message);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="compression-tool-panel">
            <h2 className="compression-tool-heading">Image Compression</h2>
            <div className="compression-tool-description">
                Select an image and specify target size to compress the file
            </div>
            <form className="compression-tool-form" onSubmit={handleCompress}>
                <label
                    className={`custom-file-label${selectedFile ? " selected" : ""}`}
                    htmlFor="file-upload"
                >
                    <span>
                        {selectedFile
                            ? `✔ ${selectedFile.name} (${originalSize} MB)`
                            : "Choose Image File"}
                    </span>
                </label>
                <input
                    style={{ display: "none" }}
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />

                {previewUrl && (
                    <div className="image-preview">
                        <img src={previewUrl} alt="Preview" />
                    </div>
                )}

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
                    {downloading ? "Compressing..." : "Compress & Download Image"}
                </button>
            </form>
        </div>
    );
};

export default ImageCompressionTool;
