import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  Container, Typography, Button, Box, Chip, Paper, Avatar 
} from '@mui/material';
import { LocalHospital, CalendarMonth } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Appointment } from '../../types';
import AppointmentModal from './AppointmentModal';
import AppointmentDetailModal from './AppointmentDetailModal';
import ChatModal from '../../components/ChatModal';
import axios from 'axios';

const checkSameDay = (d1: any, d2: any) => {
  if (!d1 || !d2) return false;
  const date1 = new Date(d1).setHours(0, 0, 0, 0);
  const date2 = new Date(d2).setHours(0, 0, 0, 0);
  return date1 === date2;
};

const backgroundImageUrl = 'https://images.unsplash.com/photo-1631248055158-edec7a3c072b?q=80&w=2000&auto=format&fit=crop';

const pageContainerStyle = {
  minHeight: '100vh',
  position: 'relative',
  paddingTop: '40px',
  paddingBottom: '40px',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(10px)', 
    transform: 'scale(1.1)', 
    zIndex: -1,
  }
};

const calendarStyle = {
  '& .react-calendar': {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
  },
  '& .react-calendar__tile': {
    padding: '12px 8px',
    borderRadius: '12px',
    transition: 'all 0.2s',
    color: '#1e293b',
    '&:hover': { backgroundColor: '#f1f5f9 !important' },
  },
  '& .react-calendar__tile--active': {
    backgroundColor: '#6366f1 !important',
    color: 'white !important',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  },
  '& .react-calendar__navigation button': {
    fontSize: '18px',
    fontWeight: '700',
    color: '#6366f1',
    '&:hover': { backgroundColor: 'transparent' },
  },
  '& .react-calendar__month-view__weekdays__weekday': {
    textDecoration: 'none',
    fontWeight: '700',
    color: '#94a3b8',
    fontSize: '12px',
    textTransform: 'uppercase',
  }
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth(); 
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDoctor, setChatDoctor] = useState<any>(null); 

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/appointments'); 
      const allApps = Array.isArray(response.data) ? response.data : [];
      const myApps = allApps.filter((app: any) => app.status !== 'CANCELLED');
      setAppointments(myApps);
    } catch (error: any) {
      console.error("Randevular çekilemedi:", error);
      setAppointments([]); 
    }
  }, []);

  const handleCancelAppointment = async (appointmentId: string) => {
    if(!window.confirm("Randevuyu iptal etmek istediğinize emin misiniz?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointments(prev => prev.filter(app => String(app.id) !== String(appointmentId)));
      alert("Randevu başarıyla iptal edildi.");
      setIsDetailOpen(false); 
      fetchAppointments(); 
    } catch (error: any) {
      console.error("Silme hatası:", error);
      alert("İşlem başarısız: Yetkiniz olmayabilir veya randevu bulunamadı.");
    }
  };

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const filteredAppointments = appointments.filter(app => checkSameDay(app.date, selectedDate));

  const tileContent = useCallback(({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasApp = appointments.some(app => checkSameDay(app.date, date));
      if (hasApp) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
            <Box sx={{ height: 6, width: 6, bgcolor: '#6366f1', borderRadius: '50%' }} />
          </Box>
        );
      }
    }
    return <Box sx={{ height: 11 }} />;
  }, [appointments]);

  const getDoctorName = (app: any) => {
    if (app?.doctorName) return app.doctorName;
    const ids: any = { "1": "Dr. Ahmet Yılmaz", "2": "Dr. Ayşe Demir", "3": "Dr. Mehmet Kaya" };
    return ids[String(app?.doctorId)] || "Bilinmeyen Doktor"; 
  };

  return (
    <Box sx={pageContainerStyle}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 4, fontWeight: 700 }}>
          Hoş geldin, {user?.name || 'Kullanıcı'}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' } }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <CalendarMonth sx={{ color: '#6366f1' }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Randevu Takvimi</Typography>
              </Box>
              
              <Box sx={calendarStyle}>
                <Calendar 
                  onChange={(date) => setSelectedDate(date as Date)} 
                  value={selectedDate}
                  tileContent={tileContent}
                  locale="tr-TR"
                />
              </Box>

              <Button 
                fullWidth variant="contained" 
                onClick={() => setIsModalOpen(true)}
                sx={{ mt: 4, py: 1.8, borderRadius: '18px', fontWeight: 700, textTransform: 'none', bgcolor: '#6366f1', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}
              >
                Yeni Randevu Al
              </Button>
            </Paper>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
            <Box sx={{ mb: 4, color: 'white' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400 }}>
                {filteredAppointments.length > 0 
                  ? `Bugün için ${filteredAppointments.length} randevunuz bulunuyor.`
                  : 'Bugün için planlanmış bir randevu yok.'}
              </Typography>
            </Box>

            <Box>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app: any) => (
                  <Paper 
                    key={app.id} 
                    elevation={0}
                    onClick={() => { setSelectedAppt(app); setIsDetailOpen(true); }}
                    sx={{ 
                      p: 3, mb: 2, borderRadius: '20px', 
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer', 
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' } 
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#eef2ff', color: '#6366f1', width: 50, height: 50 }}>
                          <LocalHospital />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={800} color="#1e293b">
                            {getDoctorName(app)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {app.time} - {app.status === 'APPROVED' ? 'Onaylı Randevu' : 'Onay Bekliyor'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={app.status === 'APPROVED' ? 'ONAYLANDI' : 'BEKLİYOR'} 
                        color={app.status === 'APPROVED' ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, borderRadius: '8px' }}
                        size="small"
                      />
                    </Box>
                  </Paper>
                ))
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.1)', border: '2px dashed rgba(255,255,255,0.3)' }}>
                  <Typography color="white" sx={{ opacity: 0.7 }}>Bu tarihte randevunuz bulunmamaktadır.</Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>

        <AppointmentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchAppointments} />
        
        {selectedAppt && (
          <AppointmentDetailModal 
            open={isDetailOpen}
            appointment={{ ...selectedAppt, doctorName: getDoctorName(selectedAppt) }}
            onClose={() => setIsDetailOpen(false)}
            onUpdate={fetchAppointments}
            onCancel={() => handleCancelAppointment(selectedAppt.id)}
            onOpenChat={(doctor: { id: string; name: string }) => { 
            setChatDoctor(doctor); 
            setIsChatOpen(true); 
            }}          
          />
        )}
        
        {isChatOpen && (
          <ChatModal 
            open={isChatOpen} 
            doctor={chatDoctor}
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </Container>
    </Box>
  );
};

export default UserDashboard;