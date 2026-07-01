import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
  Fade,
  Grow
} from "@mui/material";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications } from "../hooks/useNotifications";
import { Log } from "../utils/logger";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem("read_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const { notifications, totalPages, loading, error } = useNotifications({
    page,
    limit: 10,
    type: filter,
  });

  const handleFilterChange = (e, newFilter) => {
    if (newFilter !== null) {
      Log('frontend', 'info', 'component', `User changed filter to: ${newFilter}`);
      setFilter(newFilter);
      setPage(1);
    }
  };

  const handlePageChange = (_, newPage) => {
    Log('frontend', 'info', 'component', `User changed page to: ${newPage}`);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkRead = (id) => {
    if (!readIds.includes(id)) {
      Log('frontend', 'info', 'component', `User marked notification as read: ${id}`);
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem("read_notifications", JSON.stringify(newReadIds));
    }
  };

  const unreadCount = notifications.filter(n => !readIds.includes(n.ID)).length;

  return (
    <Box sx={{ minHeight: '100vh', pb: 12 }}>
      <Box 
        sx={{ 
          pt: { xs: 6, md: 10 },
          pb: 6,
          textAlign: 'center'
        }}
      >
        <Fade in timeout={800}>
          <Box>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '4rem' }, 
                fontWeight: 800, 
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Updates
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.2rem', maxWidth: 400, mx: 'auto', mb: 6 }}>
              {unreadCount > 0 
                ? `You have ${unreadCount} new notification${unreadCount > 1 ? 's' : ''} waiting for you.` 
                : "You are completely caught up for today."}
            </Typography>
            
            <NotificationFilter value={filter} onChange={handleFilterChange} />
          </Box>
        </Fade>
      </Box>

      <Box sx={{ maxWidth: 680, mx: "auto", px: { xs: 2, sm: 3 } }}>
        {loading && (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress size={60} thickness={3} sx={{ color: 'primary.main' }} />
          </Box>
        )}

        {!loading && error && (
          <Fade in timeout={500}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 4, 
                bgcolor: 'rgba(211, 47, 47, 0.1)', 
                color: '#ef5350',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(211,47,47,0.3)'
              }}
            >
              Failed to load notifications: {error}
            </Alert>
          </Fade>
        )}

        {!loading && !error && notifications.length === 0 && (
          <Fade in timeout={500}>
            <Alert 
              severity="info" 
              icon={false}
              sx={{ 
                borderRadius: 4, 
                bgcolor: 'rgba(255, 255, 255, 0.02)', 
                color: 'text.secondary',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center',
                py: 4
              }}
            >
              <Typography variant="h6" color="text.primary" mb={1}>All Clear</Typography>
              Nothing to see here for the selected filter.
            </Alert>
          </Fade>
        )}

        {!loading && !error && notifications.length > 0 && (
          <Stack spacing={2.5}>
            {notifications.map((n, index) => (
              <Grow 
                key={n.ID} 
                in 
                timeout={500} 
                style={{ transformOrigin: 'top center', transitionDelay: `${index * 50}ms` }}
              >
                <Box>
                  <NotificationCard 
                    notification={n} 
                    isRead={readIds.includes(n.ID)}
                    onMarkRead={handleMarkRead}
                  />
                </Box>
              </Grow>
            ))}
          </Stack>
        )}

        {!loading && !error && notifications.length > 0 && (
          <Box display="flex" justifyContent="center" mt={8}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
