import React from 'react';
import {
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function UserList() {
  const location = useLocation();

  const { data: users = [], isPending, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/user/list').then((res) => res.data),
  });

  if (isPending) {
    return <CircularProgress size={28} />;
  }

  if (isError) {
    return <Typography color="error">Unable to load users.</Typography>;
  }

  if (users.length === 0) {
    return <Typography>No users found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>
      <List component="nav" aria-label="user list">
        {users.map((user, index) => {
          const fullName = `${user.first_name} ${user.last_name}`;
          const isSelected = location.pathname === `/users/${user._id}`
            || location.pathname === `/users/${user._id}/photos`;

          return (
            <React.Fragment key={user._id}>
              <ListItemButton
                component={Link}
                to={`/users/${user._id}`}
                selected={isSelected}
              >
                <ListItemText
                  primary={fullName}
                  secondary={user.location}
                />
              </ListItemButton>
              {index < users.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
