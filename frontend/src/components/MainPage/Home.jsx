import React from 'react';
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalculateIcon from '@mui/icons-material/Calculate';
import './Home.css';
export default function Home() {
  const navigate = useNavigate();
  const handleKeyDown = (event, path) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate(path);
    }
  };
  return (
    <div className="home-root">
      <div className="home-heading-wrapper">
        <h1 className="home-heading">Your Complete Web Tools Collection</h1>
      </div>
      <div className="home-subheading">
        All the tools you need for your online tasks in one place. Simple, secure, and completely free
      </div>
      <div className="home-cards-grid">
        <div
          className="home-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/pdf-tools')}
          onKeyDown={(e) => handleKeyDown(e, '/pdf-tools')}>
          <div className="home-card-avatar pdf">
            <PictureAsPdfIcon fontSize="large" />
          </div>
          <div className="home-card-title">PDF Tools</div>
        </div>
        <div
          className="home-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/calculators')}
          onKeyDown={(e) => handleKeyDown(e, '/calculators')}>
          <div className="home-card-avatar calc">
            <CalculateIcon fontSize="large" />
          </div>
          <div className="home-card-title">Calculator</div>
        </div>
        <div
          className="home-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/compression')}
          onKeyDown={(e) => handleKeyDown(e, '/compression')}>
          <div className="home-card-avatar compress">
            <PictureAsPdfIcon fontSize="large" />
          </div>
          <div className="home-card-title">Compress</div>
        </div>
        <div
          className="home-card"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/converters')}
          onKeyDown={(e) => handleKeyDown(e, '/converters')}>
          <div className="home-card-avatar convert">
            <PictureAsPdfIcon fontSize="large" />
          </div>
          <div className="home-card-title">Converters</div>
        </div>
      </div>
    </div>
  );
}