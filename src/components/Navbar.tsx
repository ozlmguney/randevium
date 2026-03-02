import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ForumIcon from '@mui/icons-material/Forum'; 
import ChatModal from './ChatModal'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid #e2e8f0',
          color: 'primary.main',
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/"
            sx={{ 
              fontWeight: 800, 
              textDecoration: 'none', 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box sx={{ width: 32, height: 32, bgcolor: 'secondary.main', borderRadius: '8px' }} />
            Randevium
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user && user.role === 'USER' && (
              <Button
                variant="outlined"
                startIcon={<ForumIcon />} 
                onClick={() => setIsChatOpen(true)}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  borderWidth: '2px',
                  '&:hover': { borderWidth: '2px' }
                }}
              >
                Doktoruna Sor
              </Button>
            )}

            {user ? (
              <Button 
                onClick={handleLogout}
                variant="contained"
                sx={{ 
                  bgcolor: 'error.light', 
                  color: 'white', 
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'error.main' } 
                }}
              >
                Çıkış Yap
              </Button>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>

      <ChatModal open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default Navbar;