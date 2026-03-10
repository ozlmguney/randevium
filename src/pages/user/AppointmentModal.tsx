import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Stack } from '@mui/material';
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext';

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    if (open) {
      axios.get('http://localhost:5001/api/doctors')
        .then(res => setDoctors(res.data))
        .catch(() => {
           console.log("Doktorlar yüklenemedi.");
        });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
        ...formData,
        userEmail: user?.email,
        userId: user?.id || "misafir_user",
        status: 'PENDING'
    };

    try {
        await axios.post('http://localhost:5001/api/appointments', appointmentData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        onSuccess();
        onClose();
        setFormData({ doctorId: '', date: '', time: '', description: '' }); 
    } catch (err) {
        alert("Randevu oluşturulurken hata oluştu. Lütfen tekrar giriş yapın.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, bgcolor: 'white', p: 4, borderRadius: '24px', boxShadow: 24
      }}>
        <Typography variant="h6" fontWeight={800} mb={3}>Yeni Randevu Talebi</Typography>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select label="Doktor Seçin" fullWidth required
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            >
              {doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</MenuItem>
              ))}
            </TextField>

            <TextField
              type="date" label="Tarih" fullWidth required InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />

            <TextField
              type="time" label="Saat" fullWidth required InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />

            <TextField
              label="Şikayetiniz / Notunuz" fullWidth multiline rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Button 
              type="submit" variant="contained" fullWidth 
              sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700, bgcolor: '#6366f1' }}
            >
              Talebi Gönder
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default AppointmentModal;