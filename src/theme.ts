import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d', 
    },
    secondary: {
      main: '#4fd1c5', 
    },
    error: {
      main: '#f687b3', 
    },
    background: {
      default: '#f7fafc', 
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif', 
    h4: { fontWeight: 800, color: '#1a365d' },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 16, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(79, 209, 197, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0', // Hafif bir çerçeve ile derinlik
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});