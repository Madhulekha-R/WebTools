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

### Render Deployment (Recommended)

This project is configured for easy deployment on Render using the included `render.yaml` file.

**Prerequisites:**
- GitHub account
- Render account (free at render.com)

**Steps:**

1. **Push code to GitHub** (if not already done)
   ```bash
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Deploy from Blueprint**
   - Click "New" → "Blueprint"
   - Connect your GitHub repository: `Madhulekha-R/WebTools`
   - Render will auto-detect `render.yaml`
   - Click "Apply"

4. **Set Environment Variables**
   
   After services are created, set these variables:
   
   **Backend Service:**
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `FRONTEND_URL` = (copy your frontend URL from Render)
   
   **Frontend Service:**
   - `VITE_API_URL` = (copy your backend URL from Render)

5. **Redeploy Services**
   - After setting environment variables, manually redeploy both services
   - Backend: Click "Manual Deploy" → "Deploy latest commit"
   - Frontend: Click "Manual Deploy" → "Deploy latest commit"

6. **Access Your Website**
   - Frontend URL: `https://webtools-frontend.onrender.com`
   - Backend API: `https://webtools-backend.onrender.com`

### Environment Variables for Production

**Backend:**
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://webtools-frontend.onrender.com
```

**Frontend:**
```
VITE_API_URL=https://webtools-backend.onrender.com
```

### Custom Domain (Optional)

1. In Render dashboard, go to your frontend service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `webtoolgenius.com`)
4. Update DNS records at your domain registrar (GoDaddy):
   - Type: CNAME
   - Name: www
   - Value: (provided by Render)
5. SSL certificate will be automatically provisioned

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## 📧 Contact

For questions or support, please open an issue.
