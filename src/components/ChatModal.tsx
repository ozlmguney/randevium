import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, Box, Typography, TextField, Button, MenuItem, 
  Paper, IconButton, Divider, Avatar, Badge 
} from '@mui/material';
import { Send, Close, Forum } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatModal = ({ open, onClose }: any) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null); 
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (open) {
      axios.get('http://localhost:5001/api/doctors').then(res => setDoctors(res.data));
    }
  }, [open]);

  useEffect(() => {
    if (open && selectedDoctor) {
      fetchSpecificMessages();
    } else {
      setChatHistory([]); 
    }
  }, [selectedDoctor, open]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const fetchSpecificMessages = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/messages');
      const filteredMessages = res.data.filter((m: any) => 
        String(m.userId) === String(user?.id) && 
        String(m.doctorId) === String(selectedDoctor?.id)
      );
      setChatHistory(filteredMessages);
    } catch (err) {
      console.error("Mesajlar çekilemedi");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !message.trim()) return;

    const userMsg = {
      userId: user?.id,
      doctorId: selectedDoctor.id,
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await axios.post('http://localhost:5001/api/messages', userMsg);
      setMessage('');
      fetchSpecificMessages();

      setIsTyping(true);
      setTimeout(async () => {
        const botMsg = {
          userId: user?.id,
          doctorId: selectedDoctor.id,
          text: `Merhaba ${user?.name || 'Hastamız'}, mesajınızı aldım. En kısa sürede size döneceğim.`,
          sender: 'doctor',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        await axios.post('http://localhost:5001/api/messages', botMsg);
        setIsTyping(false);
        fetchSpecificMessages();
      }, 2500);

    } catch (err) { alert("Hata!"); }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#6366f1', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
            <Forum />
            <Typography variant="h6" fontWeight={700}>
              {selectedDoctor ? selectedDoctor.name : 'Sohbetler'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}><Close /></IconButton>
        </Box>

        <Box sx={{ 
          p: 1.5, 
          display: 'flex', 
          gap: 2, 
          overflowX: 'auto', 
          bgcolor: '#f8fafc', 
          borderBottom: '1px solid #e2e8f0',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {doctors.map((doc: any) => (
            <Box 
              key={doc.id} 
              onClick={() => setSelectedDoctor(doc)}
              sx={{ 
                textAlign: 'center', cursor: 'pointer', minWidth: '75px',
                opacity: selectedDoctor?.id === doc.id ? 1 : 0.6,
                transform: selectedDoctor?.id === doc.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={doc.isOnline ? "success" : "error"}
                sx={{ "& .MuiBadge-badge": { width: 12, height: 12, borderRadius: "50%", border: '2px solid white' } }}
              >
              <Avatar 
              src={doc.avatarUrl || `https://i.pravatar.cc/150?u=${doc.id}`} 
              sx={{ 
                width: 55, 
                height: 55, 
                mx: 'auto', 
                mb: 0.5, 
                boxShadow: selectedDoctor?.id === doc.id ? '0 0 10px #6366f1' : 'none' 
              }} 
            />
              </Badge>
              <Typography sx={{ fontSize: '11px', fontWeight: selectedDoctor?.id === doc.id ? 800 : 500 }}>
                {doc.name.split(' ')[1]}
              </Typography>
            </Box>
          ))}
        </Box>

        
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {!selectedDoctor ? (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Typography color="text.secondary" fontWeight={500}>Mesajlaşmak için yukarıdan <br/> bir doktor seçin.</Typography>
            </Box>
          ) : chatHistory.length === 0 && !isTyping ? (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: '#94a3b8' }}>
              {selectedDoctor.name} ile henüz bir mesajlaşmanız yok.
            </Typography>
          ) : (
            chatHistory.map((chat, index) => (
              <Box key={index} sx={{ alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <Paper sx={{ 
                  p: 1.5, 
                  borderRadius: chat.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  bgcolor: chat.sender === 'user' ? '#6366f1' : 'white',
                  color: chat.sender === 'user' ? 'white' : '#1e293b',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{chat.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7, fontSize: '10px' }}>
                    {chat.timestamp}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
          {isTyping && (
            <Box sx={{ alignSelf: 'flex-start', bgcolor: '#e2e8f0', p: 1, px: 2, borderRadius: '15px' }}>
              <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                Doktor yazıyor...
              </Typography>
            </Box>
          )}
          <div ref={scrollRef} />
        </Box>

        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 1, borderTop: '1px solid #e2e8f0' }}>
          <TextField 
            disabled={!selectedDoctor}
            fullWidth size="small" 
            placeholder={selectedDoctor ? "Mesajınızı yazın..." : "Önce doktor seçin"} 
            value={message} onChange={(e) => setMessage(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: '20px' } }}
          />
          <IconButton 
            disabled={!selectedDoctor || !message.trim()}
            type="submit" 
            sx={{ bgcolor: '#6366f1', color: 'white', "&:hover": { bgcolor: '#4f46e5' }, "&.Mui-disabled": { bgcolor: '#e2e8f0' } }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: 450 },
  height: '85vh',
  maxHeight: '650px',
  bgcolor: 'white',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

export default ChatModal;