import React, {useState} from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from 'react-dom/client';
import { Grid, Paper, Typography } from '@mui/material';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './styles/main.css';
import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';

const queryClient = new QueryClient();

function Home() {
  return (
    <Typography variant="h5">
      Select a user from the list to view their details and photos.
    </Typography>
  );
}

function Root({loggedInUser, setLoggedInUser}) {

  if (!loggedInUser) {
    return <Navigate to="/login-register" replace />;
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar loggedInUser={loggedInUser}  setLoggedInUser={setLoggedInUser}/>
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item xs={12} sm={3}>
          <Paper className="main-grid-item">
            <UserList />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Paper className="main-grid-item">
            <Outlet />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function App () { 
  const [loggedInUser, setLoggedInUser] = useState(null);

  const router = createBrowserRouter([
    {
      path: '/login-register',
      element: loggedInUser 
      ? <Navigate to={`/users/${loggedInUser._id}`} replace /> 
      : <LoginRegister setLoggedInUser={setLoggedInUser} />,
    },
    {
      path: '/',
      element: <Root loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>,
      children: [
        { index: true, element: <Home /> },
        { path: 'users', element: <Home /> },
        { path: 'users/:userId', element: <UserDetail /> },
        { path: 'users/:userId/photos', element: <UserPhotos /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById('photoshareapp'));
root.render(
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>);
