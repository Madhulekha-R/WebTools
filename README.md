# WebTools - Free Online PDF & Calculator Tools

A comprehensive web application offering free PDF manipulation tools and various calculators.

## 🚀 Features

### PDF Tools
- PDF to Word, Excel, PowerPoint conversion
- Image to PDF conversion
- Compress, Merge, Split PDFs
- Add watermarks, page numbers
- Protect/Unlock PDFs
- And more...

### Calculators
- Financial: Mortgage, Retirement, Sales Tax
- Fitness: BMI, BMR, Calorie, Body Fat
- Health: Pregnancy, Conception
- Math: Percentage, Pace
- And more...

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- React Router
- Material-UI
- Axios

**Backend:**
- Node.js
- Express
- LibreOffice (document conversion)
- pdf-lib, PDFKit
- Puppeteer
- Sharp (image processing)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- LibreOffice (for document conversion)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/webtools.git
cd webtools
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. **Run Development Servers**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in new terminal):
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## 🚢 Deployment

### Railway Deployment

1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Create two services:
   - **Backend**: Root directory `/backend`
   - **Frontend**: Root directory `/frontend`
4. Set environment variables in Railway dashboard
5. Deploy!

### Environment Variables for Production

**Backend:**
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
```

**Frontend:**
```
VITE_API_URL=https://your-backend.railway.app
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## 📧 Contact

For questions or support, please open an issue.
