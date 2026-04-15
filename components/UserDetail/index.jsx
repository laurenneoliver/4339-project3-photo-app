import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function UserDetail() {
  const { userId } = useParams();
  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/user/${userId}`).then((res) => res.data),
  });

  if (isPending) {
    return <CircularProgress size={28} />;
  }

  if (isError) {
    return <Typography color="error">User not found.</Typography>;
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
