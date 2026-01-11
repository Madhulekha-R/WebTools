const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const libre = require('libreoffice-convert');
const { fromPath } = require('pdf2pic');
const { exec } = require('child_process');
const { PDFDocument, StandardFonts, rgb, degrees } = require('pdf-lib');
const PDFDocument2 = require('pdfkit');
const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const Diff = require('diff');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const cleanupFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      if (err.code === 'EBUSY' || err.code === 'EPERM') {
        console.warn(`File locked, will retry cleanup: ${filePath}`);
        setTimeout(() => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (retryErr) {
            console.error('Cleanup retry failed:', retryErr.message);
          }
        }, 1000);
      } else {
        console.error('Cleanup error:', err.message);
      }
    }
  }
};

// ============= OFFICE TO PDF CONVERSIONS =============

// Word to PDF
app.post('/api/convert/word-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please select a DOC or DOCX file.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.(doc|docx)$/i, '.pdf');

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    libre.convert(inputBuffer, '.pdf', undefined, (err, pdfBuffer) => {
      setTimeout(() => cleanupFile(inputPath), 500);

      if (err) {
        console.error('Word to PDF conversion error:', err);
        return res.status(500).json({ error: 'Conversion failed. Please try again.' });
      }

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': pdfBuffer.length
      });
      res.send(pdfBuffer);
    });
  } catch (error) {
    console.error('Word to PDF error:', error);
    setTimeout(() => cleanupFile(inputPath), 500);
    res.status(500).json({ error: 'Conversion failed. Please try again.' });
  }
});

// Excel to PDF
app.post('/api/convert/excel-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No Excel file uploaded. Please select an XLS or XLSX file.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.(xls|xlsx)$/i, '.pdf');

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    libre.convert(inputBuffer, '.pdf', undefined, (err, pdfBuffer) => {
      setTimeout(() => cleanupFile(inputPath), 500);

      if (err) {
        console.error('Excel to PDF conversion error:', err);
        return res.status(500).json({ error: 'Conversion failed. Please try again.' });
      }

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': pdfBuffer.length
      });
      res.send(pdfBuffer);
    });
  } catch (error) {
    console.error('Excel to PDF error:', error);
    setTimeout(() => cleanupFile(inputPath), 500);
    res.status(500).json({ error: 'Conversion failed. Please try again.' });
  }
});

// PowerPoint to PDF
app.post('/api/convert/powerpoint-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PowerPoint uploaded. Please select a PPT or PPTX file.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.(ppt|pptx)$/i, '.pdf');

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    libre.convert(inputBuffer, '.pdf', undefined, (err, pdfBuffer) => {
      setTimeout(() => cleanupFile(inputPath), 500);

      if (err) {
        console.error('PowerPoint to PDF conversion error:', err);
        return res.status(500).json({ error: 'Conversion failed. Please try again.' });
      }

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': pdfBuffer.length
      });
      res.send(pdfBuffer);
    });
  } catch (error) {
    console.error('PowerPoint to PDF error:', error);
    setTimeout(() => cleanupFile(inputPath), 500);
    res.status(500).json({ error: 'Conversion failed. Please try again.' });
  }
});

// JPG to PDF (Using PDFKit - Better approach)
app.post('/api/convert/jpg-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded. Please select a JPG, JPEG, or PNG file.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.(jpg|jpeg|png)$/i, '.pdf');

  try {
    const sharp = require('sharp');
    const metadata = await sharp(inputPath).metadata();

    const doc = new PDFDocument2({
      size: [metadata.width, metadata.height],
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      cleanupFile(inputPath);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': pdfBuffer.length
      });
      res.send(pdfBuffer);
    });

    doc.image(inputPath, 0, 0, { width: metadata.width, height: metadata.height });
    doc.end();
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Conversion failed: ' + error.message });
  }
});

// HTML to PDF
app.post('/api/convert/html-to-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No HTML file uploaded.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.html$/i, '.pdf');
  const outputPath = path.join(outputDir, outputFilename);

  try {
    const htmlContent = fs.readFileSync(inputPath, 'utf8');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: 'A4' });
    await browser.close();

    cleanupFile(inputPath);
    res.download(outputPath, outputFilename, () => {
      cleanupFile(outputPath);
    });
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Conversion failed: ' + error.message });
  }
});

// ============= PDF TO OTHER FORMATS (DISABLED - LibreOffice limitations) =============

// PDF to Word - DISABLED
app.post('/api/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  cleanupFile(req.file?.path);
  res.status(501).json({
    error: 'PDF to Word conversion is not reliable with LibreOffice. Feature disabled. Use online tools like Adobe Acrobat.'
  });
});

// PDF to PowerPoint - DISABLED
app.post('/api/convert/pdf-to-powerpoint', upload.single('file'), async (req, res) => {
  cleanupFile(req.file?.path);
  res.status(501).json({
    error: 'PDF to PowerPoint conversion is not reliable with LibreOffice. Feature disabled.'
  });
});

// PDF to Excel - DISABLED
app.post('/api/convert/pdf-to-excel', upload.single('file'), async (req, res) => {
  cleanupFile(req.file?.path);
  res.status(501).json({
    error: 'PDF to Excel conversion is not reliable with LibreOffice. Feature disabled.'
  });
});

// PDF to JPG (Working)
app.post('/api/convert/pdf-to-jpg', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '.jpg');

  try {
    const options = {
      density: 300,
      saveFilename: path.basename(outputFilename, '.jpg'),
      savePath: outputDir,
      format: 'jpg',
      width: 2480,
      height: 3508
    };

    const convert = fromPath(inputPath, options);
    const pageToConvert = 1;
    const result = await convert(pageToConvert, { responseType: 'image' });

    cleanupFile(inputPath);
    res.download(result.path, outputFilename, () => {
      cleanupFile(result.path);
    });
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Conversion failed: ' + error.message });
  }
});

// ============= COMPRESSION =============

// Compress PDF
app.post('/api/convert/compress-pdf', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded. Please select a PDF file.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_compressed.pdf');
  const outputPath = path.join(outputDir, outputFilename);

  const gsCmd = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

  exec(gsCmd, (error, stdout, stderr) => {
    fs.unlinkSync(inputPath);
    if (error) {
      console.error('Ghostscript failed:', stderr);
      return res.status(500).json({ error: 'Compression failed: ' + error.message });
    }
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
    });
    res.sendFile(outputPath, () => {
      fs.unlinkSync(outputPath);
    });
  });
});

// Compress Word
app.post('/api/convert/compress-word', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No Word file uploaded. Please select DOC or DOCX file.' });
  }

  const inputPath = req.file.path;
  const pdfFilename = req.file.originalname.replace(/\.(doc|docx)$/i, '.pdf');
  const compressedPdfFilename = pdfFilename.replace(/\.pdf$/i, '_compressed.pdf');
  const pdfOutputPath = path.join(outputDir, pdfFilename);
  const compressedPdfPath = path.join(outputDir, compressedPdfFilename);

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    libre.convert(inputBuffer, '.pdf', undefined, (err, pdfBuffer) => {
      setTimeout(() => cleanupFile(inputPath), 500);

      if (err) {
        console.error('Word to PDF conversion error:', err);
        return res.status(500).json({ error: 'Word to PDF conversion failed. Please try again.' });
      }

      try {
        fs.writeFileSync(pdfOutputPath, pdfBuffer);

        const gsCmd = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${compressedPdfPath}" "${pdfOutputPath}"`;
        exec(gsCmd, (error, stdout, stderr) => {
          setTimeout(() => cleanupFile(pdfOutputPath), 500);

          if (error) {
            console.error('PDF compression failed:', stderr);
            return res.status(500).json({ error: 'PDF compression failed. Please try again.' });
          }

          res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${compressedPdfFilename}"`,
          });
          res.sendFile(compressedPdfPath, (sendErr) => {
            if (sendErr) console.error('File send error:', sendErr);
            setTimeout(() => cleanupFile(compressedPdfPath), 1000);
          });
        });
      } catch (writeError) {
        console.error('File write error:', writeError);
        return res.status(500).json({ error: 'Failed to write PDF. Please try again.' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    setTimeout(() => cleanupFile(inputPath), 500);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Compress Image
app.post('/api/convert/compress-image', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const inputPath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const outputFilename = req.file.originalname.replace(/\.(jpg|jpeg|png)$/i, '_compressed' + fileExt);
  const outputPath = path.join(outputDir, outputFilename);
  const targetSize = parseFloat(req.body.targetSize);
  const quality = parseInt(req.body.quality) || 80;

  try {
    const sharp = require('sharp');

    if (targetSize && !isNaN(targetSize)) {
      const targetBytes = targetSize * 1024 * 1024;
      let currentQuality = 90;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const sharpInstance = sharp(inputPath);
        if (fileExt === '.png') {
          await sharpInstance.png({ quality: currentQuality }).toFile(outputPath);
        } else {
          await sharpInstance.jpeg({ quality: currentQuality }).toFile(outputPath);
        }

        const stats = fs.statSync(outputPath);
        if (stats.size <= targetBytes || currentQuality <= 10) {
          break;
        }

        fs.unlinkSync(outputPath);
        currentQuality -= 10;
        attempts++;
      }
    } else {
      const sharpInstance = sharp(inputPath);
      if (fileExt === '.png') {
        await sharpInstance.png({ quality }).toFile(outputPath);
      } else {
        await sharpInstance.jpeg({ quality }).toFile(outputPath);
      }
    }

    cleanupFile(inputPath);
    res.download(outputPath, outputFilename, () => {
      cleanupFile(outputPath);
    });
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Compression failed: ' + error.message });
  }
});

// ============= PDF TOOLS =============

// Rotate PDF
app.post('/api/convert/rotate-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded. Please select a PDF file.' });
  }
  const angle = parseInt(req.body.angle || req.query.angle || 90, 10);
  if (![90, 180, 270, -90, -180, -270].includes(angle)) {
    return res.status(400).json({ error: 'Invalid rotation angle. Must be 90, 180, or 270.' });
  }
  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, `_rotated${angle}.pdf`);

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.getPages().forEach(page => {
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + angle) % 360));
    });
    const rotatedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': rotatedPdfBytes.length
    });
    res.send(Buffer.from(rotatedPdfBytes));
  } catch (error) {
    console.error('Rotation failed:', error);
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Rotation failed: ' + error.message });
  }
});

// Crop PDF
app.post('/api/convert/crop-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please select a PDF file.' });
  }

  const left = parseFloat(req.body.left) || 0;
  const right = parseFloat(req.body.right) || 0;
  const top = parseFloat(req.body.top) || 0;
  const bottom = parseFloat(req.body.bottom) || 0;

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_cropped.pdf');

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    pdfDoc.getPages().forEach(page => {
      const { width, height } = page.getSize();
      page.setCropBox(left, bottom, width - left - right, height - top - bottom);
    });

    const croppedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': croppedPdfBytes.length
    });
    res.send(Buffer.from(croppedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Cropping failed: ' + error.message });
  }
});

// Merge PDF
app.post('/api/convert/merge-pdf', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: 'At least 2 PDF files required for merging' });
  }

  try {
    const mergedPdf = await PDFDocument.create();
    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
      cleanupFile(file.path);
    }
    const pdfBytes = await mergedPdf.save();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="merged.pdf"',
      'Content-Length': pdfBytes.length
    });
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    req.files?.forEach(file => cleanupFile(file.path));
    res.status(500).json({ error: 'Merge failed: ' + error.message });
  }
});

// Split PDF
app.post('/api/convert/split-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const endPage = parseInt(req.body.endPage, 10);
  const inputPath = req.file.path;

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const totalPages = pdf.getPageCount();

    if (isNaN(endPage) || endPage < 1 || endPage >= totalPages) {
      cleanupFile(inputPath);
      return res.status(400).json({ error: `Enter a value between 1 and ${totalPages - 1}` });
    }

    const pdf1 = await PDFDocument.create();
    const firstPages = await pdf1.copyPages(pdf, Array.from({ length: endPage }, (_, i) => i));
    firstPages.forEach(page => pdf1.addPage(page));
    const pdf1Bytes = await pdf1.save();

    const pdf2 = await PDFDocument.create();
    const secondPages = await pdf2.copyPages(pdf, Array.from({ length: totalPages - endPage }, (_, i) => i + endPage));
    secondPages.forEach(page => pdf2.addPage(page));
    const pdf2Bytes = await pdf2.save();

    const zipFilename = 'split_result.zip';
    const zipPath = path.join(outputDir, zipFilename);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.append(Buffer.from(pdf1Bytes), { name: 'part_1.pdf' });
    archive.append(Buffer.from(pdf2Bytes), { name: 'part_2.pdf' });
    archive.pipe(output);
    await archive.finalize();

    output.on('close', () => {
      cleanupFile(inputPath);
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFilename}"`,
      });
      res.sendFile(path.resolve(zipPath), (err) => {
        if (err) console.error('Send file error:', err);
        cleanupFile(zipPath);
      });
    });

    output.on('error', err => {
      cleanupFile(inputPath);
      cleanupFile(zipPath);
      res.status(500).json({ error: 'Split failed: ' + err.message });
    });
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Split failed: ' + error.message });
  }
});

// Add Page Numbers
app.post('/api/convert/add-page-numbers', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_numbered.pdf');

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNumber = `${index + 1}`;
      page.drawText(pageNumber, {
        x: width / 2 - 10,
        y: 30,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
    });

    const numberedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': numberedPdfBytes.length
    });
    res.send(Buffer.from(numberedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Adding page numbers failed: ' + error.message });
  }
});

// Edit PDF
app.post('/api/convert/edit-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_edited.pdf');
  const { text = 'Edited by AI', fontSize = 18 } = req.body;
  const bottomBuffer = 72;

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    if (pages.length > 0) {
      const page = pages[0];
      page.drawText(text, {
        x: 50,
        y: bottomBuffer,
        size: Number(fontSize),
        color: rgb(0, 0.53, 0.32),
      });
    }

    const editedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': editedPdfBytes.length,
    });
    res.send(Buffer.from(editedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Editing failed: ' + error.message });
  }
});

// Watermark PDF
app.post('/api/convert/watermark-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_watermarked.pdf');
  const { text = 'CONFIDENTIAL', opacity = 0.3 } = req.body;

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 60,
        font: font,
        color: rgb(0.7, 0.7, 0.7),
        opacity: parseFloat(opacity),
        rotate: degrees(45),
      });
    });

    const watermarkedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': watermarkedPdfBytes.length
    });
    res.send(Buffer.from(watermarkedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Watermarking failed: ' + error.message });
  }
});

// Unlock PDF
app.post('/api/convert/unlock-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_unlocked.pdf');
  const { password } = req.body;

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { password });
    const unlockedPdfBytes = await pdfDoc.save();

    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': unlockedPdfBytes.length
    });
    res.send(Buffer.from(unlockedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Unlock failed: ' + error.message });
  }
});

// Protect PDF - DISABLED (requires additional libraries)
app.post('/api/convert/protect-pdf', upload.single('file'), async (req, res) => {
  cleanupFile(req.file?.path);
  res.status(501).json({
    error: 'Password protection requires additional libraries like node-qpdf. Feature not yet implemented.'
  });
});

// Organize PDF
app.post('/api/convert/organize-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_organized.pdf');
  const { pageOrder } = req.body;

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();

    const order = typeof pageOrder === 'string'
      ? pageOrder.split(',').map(n => parseInt(n.trim()) - 1)
      : pageOrder.map(n => n - 1);

    for (const pageIndex of order) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
      newPdf.addPage(copiedPage);
    }

    const organizedPdfBytes = await newPdf.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': organizedPdfBytes.length
    });
    res.send(Buffer.from(organizedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Organizing failed: ' + error.message });
  }
});

// Redact PDF
app.post('/api/convert/redact-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_redacted.pdf');
  const wordsToRedactRaw = req.body.words || '';
  const wordsToRedact = wordsToRedactRaw.split(',').map(s => s.trim()).filter(s => !!s);

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    pdfDoc.getPages().forEach(page => {
      const { width, height } = page.getSize();
      wordsToRedact.forEach((word, i) => {
        page.drawRectangle({
          x: 50 + (i * 20),
          y: height - 80 - (i * 24),
          width: 140,
          height: 18,
          color: rgb(0, 0, 0),
        });
      });
    });

    const redactedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': redactedPdfBytes.length
    });
    res.send(Buffer.from(redactedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Redaction failed: ' + error.message });
  }
});

// Sign PDF
app.post('/api/convert/sign-pdf', upload.fields([{ name: 'file' }, { name: 'signature' }]), async (req, res) => {
  if (!req.files || !req.files.file || !req.files.signature) {
    return res.status(400).json({ error: 'PDF and signature image required.' });
  }

  const inputPath = req.files.file[0].path;
  const signaturePath = req.files.signature[0].path;
  const outputFilename = req.files.file[0].originalname.replace(/\.pdf$/i, '_signed.pdf');

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const signatureBytes = fs.readFileSync(signaturePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const signatureImage = signaturePath.endsWith('.png')
      ? await pdfDoc.embedPng(signatureBytes)
      : await pdfDoc.embedJpg(signatureBytes);

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();

    lastPage.drawImage(signatureImage, {
      x: width - 200,
      y: 50,
      width: 150,
      height: 75,
    });

    const signedPdfBytes = await pdfDoc.save();
    cleanupFile(inputPath);
    cleanupFile(signaturePath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': signedPdfBytes.length
    });
    res.send(Buffer.from(signedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    if (signaturePath) cleanupFile(signaturePath);
    res.status(500).json({ error: 'Signing failed: ' + error.message });
  }
});

// Repair PDF
app.post('/api/convert/repair-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF uploaded.' });
  }

  const inputPath = req.file.path;
  const outputFilename = req.file.originalname.replace(/\.pdf$/i, '_repaired.pdf');

  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const repairedPdfBytes = await pdfDoc.save();

    cleanupFile(inputPath);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': repairedPdfBytes.length
    });
    res.send(Buffer.from(repairedPdfBytes));
  } catch (error) {
    cleanupFile(inputPath);
    res.status(500).json({ error: 'Repair failed: ' + error.message });
  }
});

// PDF to PDF/A - DISABLED
app.post('/api/convert/pdf-to-pdfa', upload.single('file'), async (req, res) => {
  cleanupFile(req.file?.path);
  res.status(501).json({
    error: 'PDF/A conversion requires Ghostscript with specific parameters. Feature not yet implemented.'
  });
});

// OCR PDF - DISABLED
app.post('/api/convert/ocr-pdf', upload.single('file'), async (req, res) => {
  cleanupFile(req.file?.path);
  res.status(501).json({
    error: 'OCR functionality requires Tesseract.js integration. Feature not yet implemented.'
  });
});

// Compare PDF - DISABLED
app.post('/api/convert/compare-pdf', upload.array('files', 2), async (req, res) => {
  req.files?.forEach(file => cleanupFile(file.path));
  res.status(501).json({
    error: 'PDF comparison requires advanced text extraction. Feature not yet implemented.'
  });
});

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('✅ All PDF Tools - FREE and Local!');
  console.log('✅ LibreOffice for Office conversions');
  console.log('✅ PDFKit for JPG to PDF');
  console.log('✅ pdf-lib for PDF manipulation');
  console.log('✅ Ghostscript for PDF compression');
  console.log('⚠️  PDF to Office conversions disabled (LibreOffice limitations)');
  console.log('Note: Server will not crash on conversion errors');
});