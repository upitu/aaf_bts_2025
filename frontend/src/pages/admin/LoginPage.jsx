import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { requestOtp } from '../../services/api';

const LoginPage = ({ onOtpRequestSuccess }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        if (!email) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }
        try {
            const response = await requestOtp(email);
            setMessage(response.message);
            // This now passes the email to the App component to switch to the OTP page
            onOtpRequestSuccess(email);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Box sx={{ width: '100%', p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography component="h1" variant="h5" fontWeight="bold" mb={3}>
                    Admin Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        required
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                    {message && <Alert severity="info" sx={{ mt: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login with Email'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
