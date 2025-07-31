import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ThankYouPage = ({ navigateTo }) => {
    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
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
                <Box color="success.main" mb={3}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 80 }} />
                </Box>
                <Typography component="h1" variant="h5" fontWeight="bold" mb={2}>
                    Thank You!
                </Typography>
                <Typography color="text.secondary" mb={4}>
                    Your entry has been confirmed. We'll announce the winner on August 31st. Good luck!
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigateTo('landing')}
                    sx={{ py: 1.5 }}
                >
                    Back to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default ThankYouPage;
