import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import { tools } from './PDFTools';
import { API_BASE_URL } from '../../config/api';
import './ToolPage.css';

const conversionEndpoints = {
  'word-to-pdf': { endpoint: '/api/convert/word-to-pdf', accept: '.doc,.docx', multiple: false },
  'pdf-to-word': { endpoint: '/api/convert/pdf-to-word', accept: '.pdf', multiple: false },
  'jpg-to-pdf': { endpoint: '/api/convert/jpg-to-pdf', accept: '.jpg,.jpeg,.png', multiple: false },
  'pdf-to-jpg': { endpoint: '/api/convert/pdf-to-jpg', accept: '.pdf', multiple: false },
  'merge-pdf': { endpoint: '/api/convert/merge-pdf', accept: '.pdf', multiple: true },
  'split-pdf': { endpoint: '/api/convert/split-pdf', accept: '.pdf', multiple: false },
  'pdf-to-powerpoint': { endpoint: '/api/convert/pdf-to-powerpoint', accept: '.pdf', multiple: false },
  'pdf-to-excel': { endpoint: '/api/convert/pdf-to-excel', accept: '.pdf', multiple: false },
  'powerpoint-to-pdf': { endpoint: '/api/convert/powerpoint-to-pdf', accept: '.ppt,.pptx', multiple: false },
  'excel-to-pdf': { endpoint: '/api/convert/excel-to-pdf', accept: '.xls,.xlsx', multiple: false },
  'html-to-pdf': { endpoint: '/api/convert/html-to-pdf', accept: '.html', multiple: false },
  'rotate-pdf': { endpoint: '/api/convert/rotate-pdf', accept: '.pdf', multiple: false },
  'redact-pdf': { endpoint: '/api/convert/redact-pdf', accept: '.pdf', multiple: false },
  'crop-pdf': { endpoint: '/api/convert/crop-pdf', accept: '.pdf', multiple: false },
  'edit-pdf': { endpoint: '/api/convert/edit-pdf', accept: '.pdf', multiple: false },
  'page-numbers': { endpoint: '/api/convert/add-page-numbers', accept: '.pdf', multiple: false },
  'watermark': { endpoint: '/api/convert/watermark-pdf', accept: '.pdf', multiple: false },
  'sign-pdf': { endpoint: '/api/convert/sign-pdf', accept: '.pdf', multiple: false },
  'unlock-pdf': { endpoint: '/api/convert/unlock-pdf', accept: '.pdf', multiple: false },
  'protect-pdf': { endpoint: '/api/convert/protect-pdf', accept: '.pdf', multiple: false },
  'organize-pdf': { endpoint: '/api/convert/organize-pdf', accept: '.pdf', multiple: false },
  'pdf-to-pdf/a': { endpoint: '/api/convert/pdf-to-pdfa', accept: '.pdf', multiple: false },
  'repair-pdf': { endpoint: '/api/convert/repair-pdf', accept: '.pdf', multiple: false },
  'ocr-pdf': { endpoint: '/api/convert/ocr-pdf', accept: '.pdf', multiple: false },
  'compare-pdf': { endpoint: '/api/convert/compare-pdf', accept: '.pdf', multiple: true },
};

export default function ToolPage() {
  const { toolName } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [files, setFiles] = useState([]);
  const [convertedFile, setConvertedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for Redact PDF input (comma-separated words/phrases)
  const [redactWords, setRedactWords] = useState('');
  const handleRedactWordsChange = e => setRedactWords(e.target.value);

  // State for Crop PDF parameters
  const [cropParams, setCropParams] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const handleCropParamChange = e => {
    setCropParams({ ...cropParams, [e.target.name]: e.target.value });
  };

  // State for Rotate PDF angle
  const [rotationAngle, setRotationAngle] = useState(90);

  // State for Edit PDF text (for simplicity, we use a fixed text here)
  const [editText, setEditText] = useState('Edited by AI');

  const [splitPageNumber, setSplitPageNumber] = useState('');

  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkImage, setWatermarkImage] = useState(null);

  // State for Sign PDF
  const [signatureImage, setSignatureImage] = useState(null);

  // State for Unlock PDF
  const [unlockPassword, setUnlockPassword] = useState('');

  // State for Protect PDF
  const [protectUserPassword, setProtectUserPassword] = useState('');
  const [protectOwnerPassword, setProtectOwnerPassword] = useState('');

  // State for Organize PDF
  const [pageOrder, setPageOrder] = useState('');

  // State for OCR PDF
  const [ocrLanguage, setOcrLanguage] = useState('eng');



  useEffect(() => {
    const tool = tools.find(t =>
      t.name.toLowerCase().replace(/ /g, '-') === toolName
    );
    if (!tool) {
      navigate('/pdf-tools');
    } else {
      setSelectedTool(tool);
      setFiles([]);
      setConvertedFile(null);
      setError(null);
      setUploadProgress(0);
      setRedactWords('');
      setCropParams({ left: 0, right: 0, top: 0, bottom: 0 });
    }
  }, [toolName, navigate]);

  const conversionConfig = selectedTool
    ? conversionEndpoints[selectedTool.name.toLowerCase().replace(/ /g, '-')]
    : null;

  const handleButtonClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (conversionConfig?.multiple) {
      setFiles(prev => [...prev, ...selectedFiles]);
    } else {
      setFiles(selectedFiles);
    }
    setConvertedFile(null);
    setError(null);
    setUploadProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(droppedFiles);
      setConvertedFile(null);
      setError(null);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setConvertedFile(null);
    setError(null);
    setUploadProgress(0);
  };

  const handleProcess = async () => {
    if (files.length === 0 || !selectedTool) return;
    setLoading(true);
    setError(null);
    setConvertedFile(null);
    setUploadProgress(0);

    try {
      const routeKey = selectedTool.name.toLowerCase().replace(/ /g, '-');
      const conversionConfig = conversionEndpoints[routeKey];

      if (!conversionConfig) throw new Error('This conversion is not supported yet.');

      const formData = new FormData();
      // if (conversionConfig.multiple && files.length > 1) {
      //   files.forEach(file => formData.append('files', file));
      // } else {
      //   formData.append('file', files[0]);
      // }

      if (routeKey === 'edit-pdf') {
        formData.append('text', editText);
      }

      if (routeKey === 'split-pdf') {
        formData.append('endPage', splitPageNumber);
      }

      if (routeKey === 'rotate-pdf') {
        formData.append('angle', rotationAngle);
      }

      if (routeKey === 'watermark') {
        formData.append('text', watermarkText);
        formData.append('opacity', 0.3);
      }

      if (routeKey === 'sign-pdf') {
        if (!signatureImage) {
          throw new Error('Please upload a signature image');
        }
        formData.append('file', files[0]);
        formData.append('signature', signatureImage);
      }

      if (routeKey === 'unlock-pdf') {
        formData.append('password', unlockPassword);
      }

      if (routeKey === 'protect-pdf') {
        formData.append('userPassword', protectUserPassword);
        formData.append('ownerPassword', protectOwnerPassword);
      }

      if (routeKey === 'organize-pdf') {
        formData.append('pageOrder', pageOrder);
      }

      if (routeKey === 'ocr-pdf') {
        formData.append('language', ocrLanguage);
      }

      // Append additional parameters for crop and redact tools
      if (routeKey === 'crop-pdf') {
        Object.entries(cropParams).forEach(([key, val]) => formData.append(key, val));
      } else if (routeKey === 'redact-pdf') {
        formData.append('words', redactWords);
      }

      if (routeKey === 'compare-pdf' && files.length >= 2) {
        formData.append('file1', files[0]);
        formData.append('file2', files[1]);
      } else if (routeKey === 'sign-pdf') {
        // Already handled above
      } else if (conversionConfig.multiple && files.length > 1) {
        files.forEach(file => formData.append('files', file));
      } else {
        formData.append('file', files[0]);
      }

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      const response = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              data: xhr.response,
              headers: {
                'content-disposition': xhr.getResponseHeader('content-disposition')
              }
            });
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error occurred'));
        xhr.ontimeout = () => reject(new Error('Request timed out'));
        xhr.open('POST', `${API_BASE_URL}${conversionConfig.endpoint}`);
        xhr.responseType = 'blob';
        xhr.timeout = 300000;
        xhr.send(formData);
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'converted-file';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      } else {
        const originalName = files[0].name.split('.')[0];
        const extension = getOutputExtension(routeKey);
        filename = `${originalName}_converted.${extension}`;
      }

      const downloadUrl = window.URL.createObjectURL(response.data);

      setConvertedFile({
        name: filename,
        url: downloadUrl,
        size: response.data.size
      });

      setUploadProgress(100);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message || 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOutputExtension = (routeKey) => {
    const extensionMap = {
      'word-to-pdf': 'pdf',
      'jpg-to-pdf': 'pdf',
      'crop-pdf': 'pdf',
      'redact-pdf': 'pdf',
      'edit-pdf': 'pdf',
      'rotate-pdf': 'pdf',
    };
    return extensionMap[routeKey] || 'pdf';
  };

  const handleDownload = () => {
    if (!convertedFile) return;
    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(convertedFile.url);
      setConvertedFile(null);
      setFiles([]);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    return () => {
      if (convertedFile) window.URL.revokeObjectURL(convertedFile.url);
    };
  }, [convertedFile]);

  if (!selectedTool) return null;

  return (
    <div className="tool-page">
      <div className="tool-container">
        <div className="tool-header">
          <div className="tool-icon" style={{ color: selectedTool.color }}>{selectedTool.icon}</div>
          <h1>{selectedTool.name}</h1>
          <p className="tool-description">{selectedTool.desc}</p>
        </div>

        <div
          className={`enhanced-upload-area${dragActive ? ' drag-active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          tabIndex={0}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={conversionConfig?.accept || '*'}
            multiple={conversionConfig?.multiple || false}
            style={{ display: 'none' }}
          />

          <CloudUploadIcon className="upload-icon" />

          <button className="select-file-button" onClick={handleButtonClick}>
            {conversionConfig?.multiple ? 'Select Files' : 'Select File'}
          </button>

          <div className="drop-hint">or drag &amp; drop here</div>

          {conversionConfig?.accept && (
            <div className="accepted-formats">
              Supported formats: {conversionConfig.accept.replace(/\./g, '').toUpperCase()}
            </div>
          )}
        </div>

        {/* Rotate PDF input field */}
        {selectedTool?.name === 'Rotate PDF' && (
          <div className="rotation-angle-wrapper">
            <span className="rotation-angle-label">Rotation Angle:</span>
            <select
              className="rotation-angle-select"
              value={rotationAngle}
              onChange={e => setRotationAngle(Number(e.target.value))}
            >
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
          </div>
        )}

        {/* Edit PDF input field */}
        {selectedTool?.name === 'Edit PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              Text to Add:
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter text to add to the first page..."
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  height: '80px',
                  marginTop: '6px',
                  resize: 'vertical'
                }}
              />
            </label>
          </div>
        )}

        {/* Split PDF input field */}
        {selectedTool?.name === 'Split PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              Split after page:
              <input
                type="number"
                min={1}
                value={splitPageNumber}
                onChange={e => setSplitPageNumber(e.target.value)}
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                }}
              />
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Enter page number to split (e.g. 4 for pages 1-4 and 5-end).
            </small>
          </div>
        )}

        {/* Watermark input fields */}
        {selectedTool?.name === 'Watermark' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              Watermark Text:
              <input
                type="text"
                value={watermarkText}
                onChange={e => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text (e.g., CONFIDENTIAL)"
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                }}
              />
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px', marginBottom: '12px' }}>
              The watermark will appear diagonally across all pages.
            </small>
          </div>
        )}

        {/* Crop PDF input fields */}
        {selectedTool?.name === 'Crop PDF' && (
          <div className="crop-fields" style={{ marginBottom: 20 }}>
            <label>
              Left: <input type="number" name="left" value={cropParams.left} onChange={handleCropParamChange} />
            </label>
            <label>
              Right: <input type="number" name="right" value={cropParams.right} onChange={handleCropParamChange} />
            </label>
            <label>
              Top: <input type="number" name="top" value={cropParams.top} onChange={handleCropParamChange} />
            </label>
            <label>
              Bottom: <input type="number" name="bottom" value={cropParams.bottom} onChange={handleCropParamChange} />
            </label>
            <div>
              <small>Values are in points (1 pt = 1/72 inch). Set 0 for no cropping on that side.</small>
            </div>
          </div>
        )}

        {/* Redact PDF input field */}
        {selectedTool?.name === 'Redact PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              Words/Phrases to Redact (comma-separated):
              <input
                type="text"
                value={redactWords}
                onChange={handleRedactWordsChange}
                placeholder="e.g., Aadhaar, Name, Address"
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '5px',
                }}
              />
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Enter sensitive words/phrases separated by commas.
            </small>
          </div>
        )}

        {/* Sign PDF input field */}
        {selectedTool?.name === 'Sign PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#72ffe6', fontWeight: 600, fontSize: '1rem', display: 'block', marginBottom: 8 }}>
              Upload Signature Image (PNG/JPG):
            </label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={e => setSignatureImage(e.target.files[0])}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '1.1rem',
                borderRadius: '6px',
                border: '1.5px solid #00ff94',
                backgroundColor: '#02211c',
                color: '#00ff94',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.22s, background-color 0.21s'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#00cfff';
                e.target.style.backgroundColor = '#012724';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#00ff94';
                e.target.style.backgroundColor = '#02211c';
              }}
            />
            <small style={{ color: '#22ffe4', fontSize: '0.91rem', marginTop: '5px', display: 'block', textAlign: 'center' }}>
              The signature will be placed on the last page of the PDF.
            </small>
          </div>
        )}

        {/* Unlock PDF input field */}
        {selectedTool?.name === 'Unlock PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              PDF Password:
              <input
                type="password"
                value={unlockPassword}
                onChange={e => setUnlockPassword(e.target.value)}
                placeholder="Enter PDF password"
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                }}
              />
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Enter the password to unlock the PDF.
            </small>
          </div>
        )}

        {/* Protect PDF input fields */}
        {selectedTool?.name === 'Protect PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              User Password (for opening):
              <input
                type="password"
                value={protectUserPassword}
                onChange={e => setProtectUserPassword(e.target.value)}
                placeholder="Enter user password"
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                  marginBottom: '12px',
                }}
              />
            </label>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              Owner Password (for permissions):
              <input
                type="password"
                value={protectOwnerPassword}
                onChange={e => setProtectOwnerPassword(e.target.value)}
                placeholder="Enter owner password"
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                }}
              />
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Set passwords to protect your PDF document.
            </small>
          </div>
        )}

        {/* Organize PDF input field */}
        {selectedTool?.name === 'Organize PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              Page Order (comma-separated):
              <input
                type="text"
                value={pageOrder}
                onChange={e => setPageOrder(e.target.value)}
                placeholder="e.g., 3,1,2,4"
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                }}
              />
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Enter the desired page order (e.g., 3,1,2 to reorder pages).
            </small>
          </div>
        )}

        {/* OCR PDF input field */}
        {selectedTool?.name === 'OCR PDF' && (
          <div className="redact-fields" style={{ marginBottom: 20 }}>
            <label style={{ color: '#b0b3b8', marginBottom: 8 }}>
              OCR Language:
              <select
                value={ocrLanguage}
                onChange={e => setOcrLanguage(e.target.value)}
                style={{
                  background: '#23272b',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '5px',
                  padding: '7px 12px',
                  fontSize: '1.09rem',
                  width: '100%',
                  marginTop: '6px',
                }}
              >
                <option value="eng">English</option>
                <option value="spa">Spanish</option>
                <option value="fra">French</option>
                <option value="deu">German</option>
                <option value="chi_sim">Chinese (Simplified)</option>
              </select>
            </label>
            <small style={{ color: '#888', display: 'block', marginTop: '5px' }}>
              Select the language for OCR text recognition.
            </small>
          </div>
        )}

        {files.length > 0 && (
          <div className="selected-files">
            <h3>
              <CheckCircleIcon className="success-icon" />
              Selected Files ({files.length}):
            </h3>

            <div className="files-list">
              {files.map((file, idx) => (
                <div key={idx} className="file-item">
                  <div className="file-info">
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <InsertDriveFileIcon className="file-icon" />
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <button
                    className="remove-file-btn"
                    onClick={() => handleRemoveFile(idx)}
                    disabled={loading}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <div className="error-message">
                <ErrorIcon className="error-icon" />
                {error}
              </div>
            )}

            {loading && (
              <div className="loading-section">
                <CircularProgress size={24} className="loading-spinner" />
                <span>Converting... {uploadProgress}%</span>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {!convertedFile && !loading && (
              <div className="convert-button-container">
                <button
                  className="process-button"
                  onClick={handleProcess}
                  disabled={files.length === 0 || loading}
                >
                  Convert {selectedTool.name.includes('Merge') ? 'and Merge' : ''}
                </button>
              </div>
            )}

            {convertedFile && (
              <div className="converted-file">
                <h3>
                  <CheckCircleIcon className="success-icon" />
                  Conversion Complete!
                </h3>
                <div className="converted-file-bar">
                  <div className="converted-file-info">
                    <span className="file-name">{convertedFile.name}</span>
                    <InsertDriveFileIcon className="file-icon" />
                    <span className="file-size">{formatFileSize(convertedFile.size)}</span>
                  </div>
                </div>
                <button className="download-button" onClick={handleDownload}>
                  <GetAppIcon className="download-icon" />
                  Download
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
