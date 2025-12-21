import React from "react";
import { useNavigate } from "react-router-dom";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import "./CompressionPage.css";

const tools = [
  {
    title: "PDF Compression",
    description: "Reduce the size of your PDF files while maintaining quality.",
    icon: <PictureAsPdfIcon sx={{ fontSize: 40, color: "#00ff94" }} />,
    id: "pdf",
    route: "/pdf-compress",
  },
  {
    title: "Word Compression",
    description: "Compress DOC and DOCX files for easier sharing and storage.",
    icon: <DescriptionIcon sx={{ fontSize: 40, color: "#00cfff" }} />,
    id: "word",
    route: "/word-compress",
  },
  {
    title: "Image Compression",
    description: "Shrink image files (JPG, PNG, etc.) with minimal quality loss.",
    icon: <ImageIcon sx={{ fontSize: 40, color: "#00ff94" }} />,
    id: "image",
    route: "/image-compress", // placeholder if exists
  },
];

const CompressionPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (tool) => {
    if (tool.route) {
      navigate(tool.route);
    }
  };

  return (
    <div className="compression-root">
      <div className="compression-heading-wrapper">
        <h2 className="compression-heading">Compression</h2>
      </div>
      <div className="compression-description">
        Welcome to the Compression section! Here you can reduce the size of your
        PDF, Word, and Image files easily.
      </div>
      <div className="compression-cards-grid">
        {tools.map((tool) => (
          <div
            className="compression-card"
            tabIndex={0}
            key={tool.id}
            onClick={() => handleCardClick(tool)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCardClick(tool);
              }
            }}
            role="button"
            aria-pressed="false"
          >
            <div className="compression-card-icon">{tool.icon}</div>
            <div className="compression-card-title">{tool.title}</div>
            <div className="compression-card-desc">{tool.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompressionPage;
