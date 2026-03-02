import React, { useState } from 'react';
import { useFormik } from 'formik';
import { 
  TextField, Button, Box, Typography, Paper, Link, 
  InputAdornment, IconButton, Alert, CircularProgress, Avatar 
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { Email, Lock, Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material'; 
import { loginSchema } from '../validations/authSchema';
import { useAuth } from '../context/AuthContext';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=2000&auto=format&fit=crop';

const pageContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.5), rgba(30, 41, 59, 0.5)), url(${backgroundImageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: 3,
};

const loginCardStyle = {
  p: 5,
  width: '100%',
  maxWidth: 450,
  borderRadius: '24px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)', 
  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
  border: '1px solid rgba(255, 255, 255, 0.3)',
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 100, 
      damping: 15, 
      delay: 0.2 
    }
  }
};

const Login: React.FC = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoginError(null);
      try {
        const userData = await login(values.email, values.password); 

        if (userData.role === 'ADMIN') {
          console.log("Yönetici girişi algılandı. Admin paneline aktarılıyor...");
          navigate('/admin');
        } else {
          console.log("Kullanıcı girişi başarılı. Panale aktarılıyor...");
          navigate('/dashboard');
        }
      } catch (error: any) {
        setLoginError(error.message || 'Giriş yapılırken bir hata oluştu.');
      } finally {
        setSubmitting(false); 
      }
    },
  });

  return (
    <Box sx={pageContainerStyle}>
      <motion.div initial="hidden" animate="visible" variants={cardVariants}>
        <Paper elevation={0} sx={loginCardStyle}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: '#6366f1', width: 56, height: 56 }}>
              <LocalHospital fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
              Randevium
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hoş geldiniz! Lütfen bilgilerinizi girin.
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth margin="normal" name="email" label="E-posta Adresi"
              value={formik.values.email} onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={inputStyle}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth margin="normal" name="password" label="Şifre"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password} onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={inputStyle}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button 
              type="submit" fullWidth variant="contained" 
              disabled={formik.isSubmitting} 
              sx={{ 
                mt: 4, mb: 2, py: 1.6, borderRadius: '14px', 
                textTransform: 'none', fontWeight: 700, fontSize: '16px', 
                bgcolor: '#6366f1',
                '&:hover': { bgcolor: '#4f46e5' }
              }}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Hesabınız yok mu?{' '}
                <Link component={RouterLink} to="/register" variant="subtitle2" sx={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
                  Hemen Kayıt Olun
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Login;