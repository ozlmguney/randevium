import React, { useState } from 'react';
import { useFormik } from 'formik';
import { 
  TextField, Button, Box, Typography, Paper, Link, 
  InputAdornment, IconButton, Avatar, CircularProgress, Alert 
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Person, Email, Lock, Visibility, VisibilityOff, 
  PersonAddAlt1, ArrowBack 
} from '@mui/icons-material';
import { registerSchema } from '../validations/authSchema';
import axios from 'axios';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=2000&auto=format&fit=crop';

const pageContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.55), rgba(30, 41, 59, 0.55)), url(${backgroundImageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: 3,
};

const registerCardStyle = {
  p: 5,
  width: '100%',
  maxWidth: 500,
  borderRadius: '24px',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { 
    opacity: 1, scale: 1, y: 0,
    transition: { 
      type: 'spring' as const, 
      stiffness: 100, 
      damping: 15 
    }
  }
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        console.log("İstek gönderiliyor...");
        const response = await axios.post(
  'http://localhost:5001/api/register', 
  values,
  { timeout: 10000 } 
);    
        console.log("Başarılı:", response.data);
        alert('Kayıt Başarılı!');
        navigate('/login');
      } catch (error: any) {
        console.error("HATA DETAYI:", error);
        if (!error.response) {
          setServerError("Sunucuya ulaşılamıyor. Lütfen backend'in çalıştığından emin olun.");
        } else {
          setServerError(error.response.data?.message || "Kayıt sırasında bir hata oluştu.");
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box sx={pageContainerStyle}>
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Paper elevation={0} sx={registerCardStyle}>
          <Button 
            component={RouterLink} to="/login" 
            startIcon={<ArrowBack />} 
            sx={{ mb: 2, textTransform: 'none', color: '#64748b', fontWeight: 600 }}
          >
            Giriş Ekranına Dön
          </Button>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: '#10b981', width: 56, height: 56 }}>
              <PersonAddAlt1 fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
              Yeni Kayıt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Klinik sistemine katılmak için formu doldurun.
            </Typography>
          </Box>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {serverError}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth margin="dense" name="name" label="Ad Soyad"
              value={formik.values.name} onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={inputStyle}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
                },
              }}
            />

            <TextField
              fullWidth margin="dense" name="email" label="E-posta"
              value={formik.values.email} onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={inputStyle}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                },
              }}
            />

            <TextField
              fullWidth margin="dense" name="password" label="Şifre"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password} onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={inputStyle}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth margin="dense" name="confirmPassword" label="Şifre Tekrar"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword} onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              sx={inputStyle}
            />

            <Button 
              type="submit" fullWidth variant="contained" 
              disabled={formik.isSubmitting}
              sx={{ 
                mt: 4, mb: 2, py: 1.6, borderRadius: '14px', 
                textTransform: 'none', fontWeight: 700, fontSize: '16px', 
                bgcolor: '#10b981', 
                '&:hover': { bgcolor: '#059669' } 
              }}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Kayıt Ol'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Zaten hesabınız var mı?{' '}
                <Link component={RouterLink} to="/login" variant="subtitle2" sx={{ color: '#10b981', textDecoration: 'none', fontWeight: 700 }}>
                  Giriş Yap
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Register;