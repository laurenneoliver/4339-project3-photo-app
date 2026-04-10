import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';

import './styles.css';

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchUser() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/user/${userId}`);
        if (!ignore) {
          setUser(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setUser(null);
          setError('User not found.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) {
    return <CircularProgress size={28} />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography>
          <strong>Location:</strong> {user.location}
        </Typography>
        <Typography>
          <strong>Occupation:</strong> {user.occupation}
        </Typography>
        <Typography>
          <strong>About:</strong> {user.description}
        </Typography>
      </Stack>

      <Button
        component={Link}
        to={`/users/${user._id}/photos`}
        variant="contained"
      >
        View {user.first_name}&apos;s Photos
      </Button>
    </Box>
  );
}

export default UserDetail;
