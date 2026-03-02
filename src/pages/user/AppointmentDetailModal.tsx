import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, IconButton, Button, Stack, 
  Divider, TextField, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import { api } from '../../services/api';
import axios from 'axios'; // Bu satırı ekle

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: any;
  onUpdate: () => void; 
  onOpenChat: (doctor: any) => void; 
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ 
  open, onClose, appointment, onUpdate, onOpenChat 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...appointment });
  const [doctors, setDoctors] = useState<any[]>([]);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    if (appointment) {
      setEditedData({ ...appointment });
    }
    axios.get('http://localhost:5001/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(() => {});
  }, [appointment, open]);

  if (!appointment) return null;

  const handleDelete = async () => {
    if (window.confirm("Bu randevuyu tamamen silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5001/api/appointments/${appointment.id}`, getAuthHeader());
        alert("Randevu silindi.");
        onUpdate(); 
        onClose(); 
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const updatePayload = {
        ...editedData,
        doctorName: doctors.find(d => String(d.id) === String(editedData.doctorId))?.name,
      };

      await axios.put(`http://localhost:5001/api/appointments/${appointment.id}`, updatePayload, getAuthHeader()); 
      
      setIsEditing(false);
      onUpdate(); 
      alert("Başarıyla güncellendi!");
    } catch (error: any) {
      alert("Güncelleme yapılamadı.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 450 }, bgcolor: 'white', borderRadius: '16px', p: 3, boxShadow: 24
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>
            {isEditing ? "Randevuyu Düzenle" : "Randevu Detayları"}
          </Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          {!isEditing ? (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary">Doktor</Typography>
                <Typography variant="body1" fontWeight={600}>{appointment.doctorName || "Bilinmeyen Doktor"}</Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Tarih</Typography>
                  <Typography variant="body2">{new Date(appointment.date).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Saat</Typography>
                  <Typography variant="body2">{appointment.time}</Typography>
                </Box>
              </Stack>
              <Box>
                <Typography variant="caption" color="text.secondary">Şikayet / Not</Typography>
                <Typography variant="body2">{appointment.description || "Not eklenmemiş"}</Typography>
              </Box>
            </>
          ) : (
            <Stack spacing={2} mt={1}>
              <TextField
                select label="Doktor" fullWidth size="small"
                value={editedData.doctorId}
                onChange={(e) => setEditedData({...editedData, doctorId: e.target.value})}
              >
                {doctors.map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>
                ))}
              </TextField>

              <TextField 
                label="Tarih" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }}
                value={editedData.date}
                onChange={(e) => setEditedData({...editedData, date: e.target.value})}
              />

              <TextField 
                label="Saat" type="time" fullWidth size="small" InputLabelProps={{ shrink: true }}
                value={editedData.time}
                onChange={(e) => setEditedData({...editedData, time: e.target.value})}
              />

              <TextField 
                label="Şikayet / Not" fullWidth multiline rows={3} size="small"
                value={editedData.description}
                onChange={(e) => setEditedData({...editedData, description: e.target.value})}
              />
            </Stack>
          )}

          <Divider />

          <Stack direction="row" spacing={1} justifyContent="center">
            {!isEditing ? (
              <>
                <Button startIcon={<ChatIcon />} variant="outlined" fullWidth onClick={() => {
                    onClose();
                    onOpenChat({ id: appointment.doctorId, name: appointment.doctorName });
                }}>Sohbet</Button>
                <Button startIcon={<EditIcon />} variant="outlined" color="info" fullWidth onClick={() => setIsEditing(true)}>Düzenle</Button>
                <Button startIcon={<DeleteIcon />} variant="outlined" color="error" fullWidth onClick={handleDelete}>İptal</Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="success" fullWidth onClick={handleSave}>Kaydet</Button>
                <Button variant="text" color="inherit" fullWidth onClick={() => setIsEditing(false)}>Vazgeç</Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AppointmentDetailModal;