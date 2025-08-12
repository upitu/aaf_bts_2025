import React, { useState } from 'react';
import { Box, Container, Typography, Stack, Select, MenuItem, Button, Alert, Grid } from '@mui/material';
import Header from '../components/Header';
import { createSubmission } from '../services/api';

const CustomFormField = ({ bgImage, label, name, value, onChange, type = "text", icon }) => (
    <Box
        sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            p: { xs: '1rem 2rem', md: '1.5rem 2.5rem' },
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'white',
                fontFamily: 'Abdo Master, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                paddingTop: '40px',
            }}
        />
    </Box>
);

const RegistrationPage = ({ navigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        emirates_id: '',
        emirate: '',
    });
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setReceipt(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.mobile || !formData.emirates_id || !formData.emirate || !receipt) {
            setError('Please fill in all fields and upload a receipt.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('receipt', receipt);

        try {
            await createSubmission(data);
            setSuccess('Thank you for your submission!');
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Header navigate={navigate} />
            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: 'url(/assets/bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Stack alignItems="center" spacing={2}>
                        <Box component="img" src="/assets/registration-title.svg" sx={{ width: { xs: '80%', md: '400px' } }} />
                        
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: { xs: '100%', md: '80%' } }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    {/* THIS IS THE FIX: Using negative spacing to create the overlap */}
                                    <Stack spacing={-4}>
                                        <CustomFormField bgImage="/assets/blue-field.svg" name="name" value={formData.name} onChange={handleChange} />
                                        <CustomFormField bgImage="/assets/red-field-email.svg" name="email" value={formData.email} onChange={handleChange} type="email" />
                                        <CustomFormField bgImage="/assets/blue-field-phone.svg" name="mobile" value={formData.mobile} onChange={handleChange} />
                                        <CustomFormField bgImage="/assets/red-field-eid.svg" name="emirates_id" value={formData.emirates_id} onChange={handleChange} />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2}>
                                        <Button component="label" sx={{ backgroundImage: 'url(/assets/upload-button.svg)', backgroundSize: '100% 100%', width:'400px', height: '150px', color: 'white', fontFamily: 'Abdo Master', fontSize: '1.2rem', textTransform: 'none' }}>
                                            Upload Purchase Receipt
                                            <input type="file" hidden onChange={handleFileChange} />
                                        </Button>
                                        {receipt && <Typography color="white" sx={{fontFamily: 'Abdo Master'}}>Selected: {receipt.name}</Typography>}
                                        
                                        <Box sx={{ backgroundImage: 'url(/assets/blue-field-emirate.svg)', backgroundSize: '100% 100%', p: '4rem 2rem 1rem 2rem' }}>
                                            <Select
                                                name="emirate"
                                                value={formData.emirate}
                                                onChange={handleChange}
                                                displayEmpty
                                                fullWidth
                                                variant="standard"
                                                sx={{ color: 'white', fontFamily: 'Abdo Master', fontSize: '1.2rem', '& .MuiSelect-icon': { color: 'white' }, '&:before, &:after': { border: 'none' } }}
                                            >
                                                
                                                <MenuItem value="Abu Dhabi" sx={{fontFamily: 'Abdo Master'}}>Abu Dhabi</MenuItem>
                                                <MenuItem value="Dubai" sx={{fontFamily: 'Abdo Master'}}>Dubai</MenuItem>
                                                <MenuItem value="Sharjah" sx={{fontFamily: 'Abdo Master'}}>Sharjah</MenuItem>
                                                <MenuItem value="Ajman" sx={{fontFamily: 'Abdo Master'}}>Ajman</MenuItem>
                                                <MenuItem value="Umm Al Quwain" sx={{fontFamily: 'Abdo Master'}}>Umm Al Quwain</MenuItem>
                                                <MenuItem value="Ras Al Khaimah" sx={{fontFamily: 'Abdo Master'}}>Ras Al Khaimah</MenuItem>
                                                <MenuItem value="Fujairah" sx={{fontFamily: 'Abdo Master'}}>Fujairah</MenuItem>
                                            </Select>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                            
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                            <Button type="submit" disabled={loading} sx={{ backgroundImage: 'url(/assets/submit-button.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '100px', width: '200px', mt: 3, color: 'black', fontFamily: 'Abdo Master', fontSize: '1.3rem', '&:hover': { backgroundColor: 'transparent' } }}>
                                Submit
                            </Button>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default RegistrationPage;
