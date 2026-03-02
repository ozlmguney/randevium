import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Paper, Typography, Box, Button, 
  Avatar, Card, CardContent, Modal, Divider, Stack, Chip,
  TextField, MenuItem, InputAdornment, IconButton
} from '@mui/material';
import { 
  EventNote, CheckCircle, PendingActions, 
  LocalHospital, Search, FilterList, Check, Delete, Edit
} from '@mui/icons-material';
import { api } from '../../services/api';
import axios from 'axios';

const backgroundImageUrl = 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=2000&auto=format&fit=crop';

const pageContainerStyle = {
  minHeight: '100vh',
  position: 'relative',
  paddingTop: '40px',
  paddingBottom: '40px',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(12px)',
    transform: 'scale(1.1)',
    zIndex: -1,
  }
};



const glassCardStyle = {
  borderRadius: '24px',
  bgcolor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
};

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, doctors: 0 });
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null); // Düzenlenen randevunun kopyası

  const handleUpdate = async () => {
  try {
    const response = await axios.put(`http://localhost:5001/api/appointments/${editData.id}`, editData);
    if(response.status === 200) {
      alert("Randevu başarıyla güncellendi!");
      setIsEditModalOpen(false);
      fetchData(); 
    }
  } catch (err) {
    alert("Güncelleme sırasında hata oluştu.");
  }
};

  const fetchData = useCallback(async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/appointments');
    
    console.log("Sunucudan Gelen Veri:", response.data); 
    if (Array.isArray(response.data)) {
      setAppointments(response.data);
      
      setStats({
        total: response.data.length,
        pending: response.data.filter((a: any) => a.status === 'PENDING').length,
        approved: response.data.filter((a: any) => a.status === 'APPROVED').length,
        doctors: 3 
      });
    }
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  }
}, []);

  useEffect(() => { fetchData(); }, [fetchData]);

 const handleApprove = async (e: React.MouseEvent, id: string) => {
  e.stopPropagation(); 
  try {
    const response = await axios.put(`http://localhost:5001/api/appointments/${id}/approve`);
    if(response.status === 200) {
       alert("Randevu başarıyla onaylandı!");
       fetchData(); 
    }
  } catch (err) {
    console.error("Onay hatası:", err);
    alert("Onaylanırken bir hata oluştu. Terminali kontrol et.");
  }
};

const handleDelete = async (e: React.MouseEvent, id: string) => {
  e.stopPropagation();
  if(window.confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
    try {
      await axios.delete(`http://localhost:5001/api/appointments/${id}`);
      fetchData(); 
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  }
};

  const filteredAppointments = appointments.filter((app) => {
  const dName = (app.doctorName || "").toLowerCase();
  const uName = (app.userName || "").toLowerCase();
  const search = searchTerm.toLowerCase();
  const status = (app.status || "").toUpperCase();

  const matchesSearch = dName.includes(search) || uName.includes(search);
  
  const matchesDoctor = doctorFilter === 'all' || app.doctorName === doctorFilter;
  
  const matchesStatus = statusFilter === 'all' || status === statusFilter.toUpperCase();

  return matchesSearch && matchesDoctor && matchesStatus;
});

  return (
    <Box sx={pageContainerStyle}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, color: 'white', letterSpacing: '-1px' }}>
          Klinik Yönetim Paneli
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {[
            { label: 'Toplam Randevu', val: stats.total, icon: <EventNote />, color: '#6366f1' },
            { label: 'Onay Bekleyen', val: stats.pending, icon: <PendingActions />, color: '#f59e0b' },
            { label: 'Tamamlanan', val: stats.approved, icon: <CheckCircle />, color: '#10b981' },
            { label: 'Aktif Doktorlar', val: stats.doctors, icon: <LocalHospital />, color: '#3b82f6' },
          ].map((item, index) => (
            <Card key={index} sx={{ ...glassCardStyle, flex: '1 1 240px' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                <Avatar sx={{ bgcolor: item.color, width: 64, height: 64 }}>{item.icon}</Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>{item.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.val}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Paper sx={{ ...glassCardStyle, p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField select label="Doktor" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} sx={{ minWidth: 200 }} size="small">
                <MenuItem value="all">Tüm Doktorlar</MenuItem>
                <MenuItem value="Dr. Ahmet Yılmaz">Dr. Ahmet Yılmaz</MenuItem>
                <MenuItem value="Dr. Ayşe Demir">Dr. Ayşe Demir</MenuItem>
                <MenuItem value="Dr. Mehmet Kaya">Dr. Mehmet Kaya</MenuItem>
            </TextField>
            <TextField fullWidth placeholder="Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="small" InputProps={{ startAdornment: <Search /> }} />
          </Stack>
        </Paper>

        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>Randevu Yönetimi</Typography>
          {filteredAppointments.map((app) => (
            <Paper 
              key={app.id} 
              onClick={() => { setSelectedApp(app); setIsDetailOpen(true); }}
              sx={{ 
                p: 2.5, mb: 2, borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: '0.2s', '&:hover': { transform: 'scale(1.01)', bgcolor: 'white' }, cursor: 'pointer'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 700 }}>{app.userName?.charAt(0)}</Avatar>
                <Box>
                  <Typography fontWeight={800}>{app.userName}</Typography>
                  <Typography variant="body2" color="text.secondary">{app.doctorName} • {app.date}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={app.status === 'APPROVED' || app.status === 'Onaylandı' ? 'Onaylandı' : 'Bekliyor'} 
                  color={app.status === 'APPROVED' || app.status === 'Onaylandı' ? 'success' : 'warning'}
                  sx={{ fontWeight: 700, mr: 2 }}
                />
                
                <IconButton color="success" onClick={(e) => handleApprove(e, app.id)} disabled={app.status === 'APPROVED' || app.status === 'Onaylandı'}>
                  <Check />
                </IconButton>
               <IconButton color="primary" onClick={(e) => { 
    e.stopPropagation(); 
    setEditData({...app}); 
    setIsEditModalOpen(true);
}}>
  <Edit />
</IconButton>
                <IconButton color="error" onClick={(e) => handleDelete(e, app.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>

        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
  <Box sx={{ 
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
    width: 450, bgcolor: 'white', p: 4, borderRadius: '24px', boxShadow: 24 
  }}>
    <Typography variant="h6" fontWeight={800} mb={3}>Randevuyu Düzenle</Typography>
    
    <Stack spacing={2}>
      <TextField 
        select label="Doktor" fullWidth
        value={editData?.doctorName || ''}
        onChange={(e) => setEditData({...editData, doctorName: e.target.value})}
      >
        <MenuItem value="Dr. Ahmet Yılmaz">Dr. Ahmet Yılmaz</MenuItem>
        <MenuItem value="Dr. Ayşe Demir">Dr. Ayşe Demir</MenuItem>
        <MenuItem value="Dr. Mehmet Kaya">Dr. Mehmet Kaya</MenuItem>
      </TextField>

      <TextField 
        type="date" label="Tarih" fullWidth InputLabelProps={{ shrink: true }}
        value={editData?.date || ''}
        onChange={(e) => setEditData({...editData, date: e.target.value})}
      />

      <TextField 
        type="time" label="Saat" fullWidth InputLabelProps={{ shrink: true }}
        value={editData?.time || ''}
        onChange={(e) => setEditData({...editData, time: e.target.value})}
      />

      <TextField 
        label="Açıklama / Not" fullWidth multiline rows={3}
        value={editData?.description || ''}
        onChange={(e) => setEditData({...editData, description: e.target.value})}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleUpdate} sx={{ mt: 2, borderRadius: '12px' }}>
        Değişiklikleri Kaydet
      </Button>
    </Stack>
  </Box>
</Modal>
      </Container>
    </Box>
  );
};

export default AdminDashboard;