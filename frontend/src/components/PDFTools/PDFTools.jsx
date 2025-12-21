import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PDFTools.css';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Button,
  Chip
} from '@mui/material';

// Import MUI icons
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import DescriptionIcon from '@mui/icons-material/Description';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TableChartIcon from '@mui/icons-material/TableChart';
import ImageIcon from '@mui/icons-material/Image';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ScannerIcon from '@mui/icons-material/Scanner';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CompareIcon from '@mui/icons-material/Compare';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BrushIcon from '@mui/icons-material/Brush';
import WatermarkIcon from '@mui/icons-material/BrandingWatermark';
import SignatureIcon from '@mui/icons-material/Draw';
import StorageIcon from '@mui/icons-material/Storage';

export const tools = [
  {
    name: 'Word to PDF',
    desc: 'Convert DOC and DOCX files to PDF',
    icon: <DescriptionIcon fontSize="large" />,
    color: '#3498db'
  },
  {
    name: 'JPG to PDF',
    desc: 'Convert JPG images to PDF in seconds',
    icon: <PictureAsPdfIcon fontSize="large" />,
    color: '#f1c40f'
  },
  {
    name: 'PowerPoint to PDF',
    desc: 'Convert PPT and PPTX slideshows to PDF',
    icon: <SlideshowIcon fontSize="large" />,
    color: '#e67e22'
  },
  {
    name: 'Excel to PDF',
    desc: 'Convert EXCEL spreadsheets to PDF',
    icon: <TableChartIcon fontSize="large" />,
    color: '#27ae60'
  },
  {
    name: 'HTML to PDF',
    desc: 'Convert webpages in HTML to PDF',
    icon: <CodeIcon fontSize="large" />,
    color: '#f1c40f'
  },
  {
    name: 'Crop PDF',
    desc: 'Crop margins of PDF documents or specific areas and apply changes',
    icon: <ContentCutIcon fontSize="large" />,
    color: '#9b59b6',
    isNew: true
  },
  {
    name: 'Rotate PDF',
    desc: 'Rotate your PDFs the way you need',
    icon: <RotateLeftIcon fontSize="large" />,
    color: '#9b59b6'
  },
  {
    name: 'Merge PDF',
    desc: 'Combine PDFs into the single PDF',
    icon: <MergeTypeIcon fontSize="large" />,
    color: '#e74c3c'
  },
  {
    name: 'Split PDF',
    desc: 'Separate one page or a whole set into independent PDF files',
    icon: <CallSplitIcon fontSize="large" />,
    color: '#e74c3c'
  },
  {
    name: 'Page numbers',
    desc: 'Add page numbers into PDFs with ease',
    icon: <FormatListNumberedIcon fontSize="large" />,
    color: '#9b59b6'
  },
  {
    name: 'Edit PDF',
    desc: 'Add text, images, shapes or freehand annotations to a PDF document',
    icon: <DriveFileRenameOutlineIcon fontSize="large" />,
    color: '#9b59b6',
    isNew: true
  },
  {
    name: 'Sign PDF',
    desc: 'Sign yourself or request electronic signatures from others',
    icon: <SignatureIcon fontSize="large" />,
    color: '#3498db'
  },
  {
    name: 'Watermark',
    desc: 'Stamp an image or text over your PDF in seconds',
    icon: <WatermarkIcon fontSize="large" />,
    color: '#9b59b6'
  },
  {
    name: 'Unlock PDF',
    desc: 'Remove PDF password security',
    icon: <LockOpenIcon fontSize="large" />,
    color: '#3498db'
  },
  {
    name: 'Organize PDF',
    desc: 'Sort or Delete or Add pages of your PDF file',
    icon: <ViewAgendaIcon fontSize="large" />,
    color: '#e67e22'
  },
  {
    name: 'Repair PDF',
    desc: 'Repair a damaged PDF and recover data from corrupt PDF',
    icon: <BuildIcon fontSize="large" />,
    color: '#27ae60'
  },
  {
    name: 'Redact PDF',
    desc: 'Redact text and graphics from your PDF',
    icon: <VisibilityOffIcon fontSize="large" />,
    color: '#3498db',
    isNew: true
  }
];

export default function PDFTools() {
  const navigate = useNavigate();

  const handleToolClick = (tool) => {
    navigate(`/tools/${tool.name.toLowerCase().replace(/ /g, '-')}`);
  };

  return (

    <div className="pdf-tools-root">
      <div className="pdf-tools-heading-wrapper">
        <h2 className="pdf-tools-heading">PDF Tools</h2>
        <p className="pdf-tools-subheading">
          All the tools you need to work with PDFs in one place. Easy to use, free, and secure.
        </p>
      </div>
      <div className="pdf-tools-grid">
        {tools.map((tool) => (
          <div
            className="pdf-tool-card"
            key={tool.name}
            onClick={() => handleToolClick(tool)}
          >
            <div className="pdf-tool-card-content">
              <div className="pdf-tool-icon" style={{ color: tool.color }}>
                {tool.icon}
              </div>
              <div className="pdf-tool-title">{tool.name}</div>
              <div className="pdf-tool-desc">{tool.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
