import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Paper, Typography, Box, Button, 
  Avatar, Card, CardContent, Modal, Stack, Chip,
  TextField, MenuItem, IconButton
} from '@mui/material';
import { 
  EventNote, CheckCircle, PendingActions, 
  LocalHospital, Search, Check, Delete, Edit
} from '@mui/icons-material';
import axios from 'axios';
import AppointmentDetailModal from '../user/AppointmentDetailModal';

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
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null); 

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('https://randevium-backend.onrender.com/api/appointments');
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

  const getDoctorName = (app: any) => {
    if (app?.doctorName) return app.doctorName;
    const ids: any = { 
      "1": "Dr. Ahmet Yılmaz", 
      "2": "Dr. Ayşe Demir", 
      "3": "Dr. Mehmet Kaya" 
    };
    return ids[String(app?.doctorId)] || "Bilinmeyen Doktor"; 
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://randevium-backend.onrender.com/api/appointments/${editData.id}`, editData);
      alert("Randevu başarıyla güncellendi!");
      setIsEditModalOpen(false);
      fetchData(); 
    } catch (err) {
      alert("Güncelleme sırasında hata oluştu.");
    }
  };

  const handleApprove = async (e: React.MouseEvent | null, id: string) => {
    e?.stopPropagation(); 
    try {
      await axios.put(`https://randevium-backend.onrender.com/api/appointments/${id}/approve`);
      alert("Randevu başarıyla onaylandı!");
      fetchData(); 
    } catch (err) {
      alert("Onaylanırken bir hata oluştu.");
    }
  };

  const handleDelete = async (e: React.MouseEvent | null, id: string) => {
    e?.stopPropagation();
    if(window.confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`https://randevium-backend.onrender.com/api/appointments/${id}`);
        alert("Randevu silindi.");
        setIsDetailOpen(false);
        fetchData(); 
      } catch (err) {
        console.error("Silme hatası:", err);
      }
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const dName = (getDoctorName(app)).toLowerCase();
    const uName = (app.userName || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = dName.includes(search) || uName.includes(search);
    const matchesDoctor = doctorFilter === 'all' || getDoctorName(app) === doctorFilter;
    return matchesSearch && matchesDoctor;
  });

  return (
    <Box sx={pageContainerStyle}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 4, color: 'white' }}>
          Klinik Yönetim Paneli
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
          {[
            { label: 'Toplam', val: stats.total, icon: <EventNote />, color: '#6366f1' },
            { label: 'Bekleyen', val: stats.pending, icon: <PendingActions />, color: '#f59e0b' },
            { label: 'Onaylı', val: stats.approved, icon: <CheckCircle />, color: '#10b981' },
            { label: 'Doktorlar', val: stats.doctors, icon: <LocalHospital />, color: '#3b82f6' },
          ].map((item, index) => (
            <Card key={index} sx={{ ...glassCardStyle, flex: '1 1 200px' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: item.color }}>{item.icon}</Avatar>
                <Box>
                  <Typography variant="caption" color="textSecondary">{item.label}</Typography>
                  <Typography variant="h5" fontWeight={800}>{item.val}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Paper sx={{ ...glassCardStyle, p: 3, mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField select label="Doktor" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} sx={{ minWidth: 200 }}>
                <MenuItem value="all">Tüm Doktorlar</MenuItem>
                <MenuItem value="Dr. Ahmet Yılmaz">Dr. Ahmet Yılmaz</MenuItem>
                <MenuItem value="Dr. Ayşe Demir">Dr. Ayşe Demir</MenuItem>
                <MenuItem value="Dr. Mehmet Kaya">Dr. Mehmet Kaya</MenuItem>
            </TextField>
            <TextField 
              fullWidth 
              placeholder="Hasta veya Doktor Ara..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              slotProps={{ input: { startAdornment: <Search sx={{mr:1, color:'gray'}} /> } }} 
            />
          </Stack>
        </Paper>

        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 3 }}>Randevu Listesi</Typography>
          {filteredAppointments.map((app) => (
            <Paper 
              key={app.id} 
              onClick={() => { 
                setSelectedAppt(app); 
                setIsDetailOpen(true); 
              }}
              sx={{ 
                p: 2, mb: 2, borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#6366f1' }}>{app.userName?.charAt(0)}</Avatar>
                <Box>
                  <Typography fontWeight={700}>{app.userName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {getDoctorName(app)} | {app.date} - {app.time}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={app.status === 'APPROVED' ? 'Onaylı' : 'Bekliyor'} 
                  color={app.status === 'APPROVED' ? 'success' : 'warning'} 
                  size="small" 
                />
                <IconButton color="success" onClick={(e) => handleApprove(e, app.id)} disabled={app.status === 'APPROVED'}>
                  <Check />
                </IconButton>
                <IconButton color="primary" onClick={(e) => { e.stopPropagation(); setEditData({...app}); setIsEditModalOpen(true); }}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={(e) => handleDelete(e, app.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>

        {selectedAppt && (
          <AppointmentDetailModal 
            open={isDetailOpen}
            appointment={{ ...selectedAppt, doctorName: getDoctorName(selectedAppt) }}
            onClose={() => setIsDetailOpen(false)}
            onUpdate={fetchData}
            onOpenChat={() => alert("Admin chat özelliği yakında!")}
            onCancel={() => handleDelete(null, selectedAppt.id)}
          />
        )}

        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>Randevu Düzenle</Typography>
            <Stack spacing={2}>
              <TextField select label="Doktor" fullWidth value={editData?.doctorName || ''} onChange={(e) => setEditData({...editData, doctorName: e.target.value})}>
                <MenuItem value="Dr. Ahmet Yılmaz">Dr. Ahmet Yılmaz</MenuItem>
                <MenuItem value="Dr. Ayşe Demir">Dr. Ayşe Demir</MenuItem>
                <MenuItem value="Dr. Mehmet Kaya">Dr. Mehmet Kaya</MenuItem>
              </TextField>
              <TextField type="date" fullWidth value={editData?.date || ''} onChange={(e) => setEditData({...editData, date: e.target.value})} />
              <TextField type="time" fullWidth value={editData?.time || ''} onChange={(e) => setEditData({...editData, time: e.target.value})} />
              <Button variant="contained" onClick={handleUpdate}>Kaydet</Button>
            </Stack>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default AdminDashboard;