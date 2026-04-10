import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import api from '../../lib/api';

import './styles.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    async function fetchUsers() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/user/list');
        if (!ignore) {
          setUsers(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError('Unable to load users.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return <CircularProgress size={28} />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
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
