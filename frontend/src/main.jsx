import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e74c3c',
    },
    secondary: {
      main: '#3498db',
    },
    background: {
      default: '#18191a',
      paper: '#23272f',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);