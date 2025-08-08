import React, { useState, useRef } from 'react';
import { Container, Box, Typography, Button, Stack, TextField, Alert } from '@mui/material';
import { verifyOtp } from '../../services/api';

const OtpPage = ({ email, onLoginSuccess }) => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (!/^[0-9]$/.test(value) && value !== "") return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const otp = code.join('');
        if (otp.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        try {
            const data = await verifyOtp(email, otp);
            onLoginSuccess(data.access_token);
        } catch (err) {
            setError(err.message || 'Invalid or expired OTP.');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Box sx={{ width: '100%', p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <Typography component="h1" variant="h5" fontWeight="bold" mb={2}>
                    Enter Your Code
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    A 6-digit code was sent to <strong>{email}</strong>.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    {/* Replaced Grid with Stack for horizontal layout */}
                    <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
                        {code.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={el => inputsRef.current[index] = el}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' } }}
                                sx={{ width: '50px' }}
                            />
                        ))}
                    </Stack>
                    {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5 }}>
                        Verify & Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default OtpPage;
