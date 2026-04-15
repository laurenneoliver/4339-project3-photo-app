import React from 'react';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from '@mui/material';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function TopBar({ loggedInUser, setLoggedInUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contextUser, isPending: loading } = useQuery({
    queryKey: ['topbar-user', location.pathname],
    queryFn: async () => {
      const photoMatch = matchPath('/users/:userId/photos', location.pathname);
      const detailMatch = matchPath('/users/:userId', location.pathname);
      const matchedUserId = photoMatch?.params.userId || detailMatch?.params.userId;

      if (!matchedUserId) {
        return null;
      }

      const response = await api.get(`/user/${matchedUserId}`);
      return { user: response.data, isPhoto: !!photoMatch };
    },
    enabled: !!loggedInUser,
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/admin/logout'),
    onSuccess: () => {
      queryClient.clear();
      setLoggedInUser(null);
      navigate('/login-register');
    },
  });

  function getContextText() {
    if (!contextUser) {
      return location.pathname === '/users' ? 'User List' : 'Photo Sharing App';
    }
    const fullName = `${contextUser.user.first_name} ${contextUser.user.last_name}`;
    return contextUser.isPhoto ? `Photos of ${fullName}` : fullName;
  }

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" color="inherit">
          {loggedInUser ? `Hi, ${loggedInUser.first_name}` : 'Photo Sharing App'}
        </Typography>
        <Box className="topbar-context">
          {loading ? (
            <CircularProgress color="inherit" size={22} />
          ) : (
            <Typography variant="h6" color="inherit">
              {getContextText()}
            </Typography>
          )}
        </Box>
        {loggedInUser && (
          <Button color="inherit" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
            {logoutMutation.isPending ? 'Logging Out...' : 'Logout'}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
