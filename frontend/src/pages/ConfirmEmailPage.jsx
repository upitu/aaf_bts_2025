import React, { useState, useRef } from 'react';
import { Container, Box, Typography, Button, Grid, TextField, Link } from '@mui/material';

const ConfirmEmailPage = ({ navigateTo }) => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const confirmationCode = code.join('');
        if (confirmationCode.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        
        console.log('Confirmation Code:', confirmationCode);
        navigateTo('thankYou');
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Box
                sx={{
                    width: '100%',
                    p: { xs: 3, sm: 5 },
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}
            >
                <Typography component="h1" variant="h5" fontWeight="bold" mb={2}>
                    Check Your Email
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    We've sent a 6-digit confirmation code to your email address.
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={1} justifyContent="center" mb={2}>
                        {code.map((digit, index) => (
                            <Grid item xs={2} key={index}>
                                <TextField
                                    inputRef={el => inputsRef.current[index] = el}
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' } }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {error && <Typography variant="caption" color="error.main" sx={{ mb: 2 }}>{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 2, py: 1.5 }}
                    >
                        Confirm
                    </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" mt={4}>
                    Didn't receive a code? <Link href="#">Resend code</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default ConfirmEmailPage;
