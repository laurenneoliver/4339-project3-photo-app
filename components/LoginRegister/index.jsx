import React, {useState} from "react";
import {
    Box,
    Button,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import api from "../../lib/api";

function LoginRegister({ setLoggedInUser }) {
    // login form state
    const [loginName, setLoginName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // register form state
    const [regLoginName, setRegLoginName] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regFirstName, setRegFirstName] = useState('');
    const [regLastName, setRegLastName] = useState('');
    const [regLocation, setRegLocation] = useState('');
    const [regDescription, setRegDescription] = useState('');
    const [regOccupation, setRegOccupation] = useState('');
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');

    const loginMutation = useMutation({
        mutationFn: (credentials) => api.post('/admin/login', credentials).then((res) => res.data),
        onSuccess: (user) => {
            setLoggedInUser(user);
        },
        onError: (err) => {
            setLoginError(err.response?.data || 'Login failed. Please try again.');
        }
    });

    const registerMutation = useMutation({
        mutationFn: (userData) => api.post('/user', userData).then((res) => res.data),
        onSuccess: () => {
            setRegSuccess('Registration successful! You can now log in.');
            setRegLoginName('');
            setRegPassword('');
            setRegConfirmPassword('');
            setRegFirstName('');
            setRegLastName('');
            setRegLocation('');
            setRegDescription('');
            setRegOccupation('');
            setRegError('');
        },
        onError: (err) => {
            setRegError(err.response?.data || 'Registration failed. Please try again.');
            setRegSuccess('');
        },
    });

    function handleLogin() {
        setLoginError('');
        if (!loginName || !loginPassword) {
            setLoginError('Please enter both username and password.');
            return;
        }
        loginMutation.mutate({ login_name: loginName, password: loginPassword });
    }

    function handleRegister() {
        setRegError('');
        setRegSuccess('');
        if (!regLoginName || !regPassword || !regFirstName || !regLastName) {
            setRegError('Please fill in all required fields.');
            return;
        }
        if (regPassword !== regConfirmPassword) {
            setRegError('Passwords do not match.');
            return;
        }
        registerMutation.mutate({
            login_name: regLoginName,
            password: regPassword,
            first_name: regFirstName,
            last_name: regLastName,
            location: regLocation,
            description: regDescription,
            occupation: regOccupation,
        });
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, px: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Photo Sharing App
            </Typography>

            {/* Login Form */}
            <Typography variant="h6" gutterBottom>
                Login
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Username"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Password"    
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    fullWidth
                />
                {loginError && <Typography color="error">{loginError}</Typography>}
                <Button variant="contained" onClick={handleLogin} disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
            </Stack>   

            <Divider sx={{ my: 4 }} />

            {/* Registration Form */}
            <Typography variant="h6" gutterBottom>
                Create Account
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Username"
                    value={regLoginName}
                    onChange={(e) => setRegLoginName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="First Name"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    fullWidth
                />  
                <TextField
                    label="Last Name"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Location (optional)"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Description (optional)"
                    value={regDescription}
                    onChange={(e) => setRegDescription(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Occupation (optional)"
                    value={regOccupation}
                    onChange={(e) => setRegOccupation(e.target.value)}
                    fullWidth
                />
                {regError && <Typography color="error">{regError}</Typography>}
                {regSuccess && <Typography color="success.main">{regSuccess}</Typography>}
                <Button variant="outlined" onClick={handleRegister} disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                </Button>
            </Stack>
        </Box>
    );
}

export default LoginRegister;