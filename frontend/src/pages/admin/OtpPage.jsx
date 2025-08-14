import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography, Button, Stack, TextField, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../services/api';

export default function OtpPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [email, setEmail] = useState(state?.email || ''); // carried from /admin/login
    const [code, setCode] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const inputsRef = useRef([]);

    // If we somehow arrive without an email (refresh/deep-link), send back to login
    useEffect(() => {
        if (!email) navigate('/admin/login', { replace: true });
    }, [email, navigate]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (value !== '' && !/^[0-9]$/.test(value)) return;

        const next = [...code];
        next[index] = value;
        setCode(next);

        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (code[index]) {
                // clear current and stay
                const next = [...code];
                next[index] = '';
                setCode(next);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // Allow pasting the 6-digit code
    const handlePaste = (e) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!text) return;
        const next = Array(6).fill('');
        for (let i = 0; i < text.length; i++) next[i] = text[i];
        setCode(next);
        inputsRef.current[Math.min(text.length, 5)]?.focus();
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const otp = code.join('');
        if (!email) {
            setError('Missing email. Please go back and request a new code.');
            return;
        }
        if (otp.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        try {
            const data = await verifyOtp(email, otp); // expects { access_token }
            localStorage.setItem('adminToken', data.access_token);
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err?.message || 'Invalid or expired OTP.');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Box
                sx={{
                    width: '100%',
                    p: 4,
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                }}
            >
                <Typography component="h1" variant="h5" fontWeight="bold" mb={2}>
                    Enter Your Code
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    A 6‑digit code was sent to <strong>{email}</strong>.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} onPaste={handlePaste}>
                    <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
                        {code.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => (inputsRef.current[index] = el)}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{
                                    maxLength: 1,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                    style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', width: 50 },
                                }}
                            />
                        ))}
                    </Stack>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5 }}>
                        Verify & Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}