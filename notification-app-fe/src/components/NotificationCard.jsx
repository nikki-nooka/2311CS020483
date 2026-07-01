import { Card, CardContent, Typography, Box, Stack, Avatar } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

const getIconConfig = (type) => {
  switch(type) {
    case 'Placement': 
      return { icon: <AssuredWorkloadIcon />, glow: 'rgba(147, 51, 234, 0.4)', color: '#a855f7' };
    case 'Result': 
      return { icon: <SchoolIcon />, glow: 'rgba(16, 185, 129, 0.4)', color: '#34d399' };
    case 'Event': 
      return { icon: <EventIcon />, glow: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' };
    default: 
      return { icon: <EventIcon />, glow: 'rgba(255, 255, 255, 0.2)', color: '#FFF' };
  }
};

export function NotificationCard({ notification, isRead, onMarkRead }) {
  const { ID, Type, Message, Timestamp } = notification;
  const config = getIconConfig(Type);

  return (
    <Card 
      onClick={() => onMarkRead(ID)}
      sx={{ 
        cursor: 'pointer',
        bgcolor: isRead ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 0.04)',
        border: '1px solid',
        borderColor: isRead ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.01)',
          bgcolor: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: `0 20px 40px -10px rgba(0,0,0,0.5)`,
        }
      }}
    >
      {!isRead && (
        <Box 
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: config.color,
            boxShadow: `0 0 20px 2px ${config.glow}`
          }}
        />
      )}
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: 'transparent',
              color: config.color,
              width: 56,
              height: 56,
              border: `1px solid rgba(255,255,255,0.1)`,
              boxShadow: !isRead ? `inset 0 0 20px ${config.glow}` : 'none'
            }}
          >
            {config.icon}
          </Avatar>
          
          <Box flex={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2" sx={{ color: config.color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {Type}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {Timestamp}
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontWeight: isRead ? 300 : 500, color: isRead ? 'rgba(255,255,255,0.6)' : '#fff', fontSize: '1.1rem', lineHeight: 1.4 }}>
              {Message}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
