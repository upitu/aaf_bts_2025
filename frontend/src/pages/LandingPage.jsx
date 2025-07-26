import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Link } from '@mui/material';

const LandingPage = ({ navigateTo }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required.';
        if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (!formData.country) newErrors.country = 'Country is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted:', formData);
            navigateTo('confirmEmail');
        }
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
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Typography component="h1" variant="h4" fontWeight="bold">
                        Back to School Giveaway!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter for a chance to win a new laptop and a $500 gift card.
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="firstName"
                                name="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="lastName"
                                name="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.country}>
                                <InputLabel id="country-label">Country</InputLabel>
                                <Select
                                    labelId="country-label"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    label="Country"
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""><em>Select your country</em></MenuItem>
                                    <MenuItem value="USA">United States</MenuItem>
                                    <MenuItem value="CAN">Canada</MenuItem>
                                    <MenuItem value="GBR">United Kingdom</MenuItem>
                                    <MenuItem value="AUS">Australia</MenuItem>
                                </Select>
                                {errors.country && <Typography variant="caption" color="error.main" sx={{ ml: 2, mt: 1 }}>{errors.country}</Typography>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        Enter Giveaway
                    </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                    By entering, you agree to our <Link href="#" onClick={(e) => { e.preventDefault(); navigateTo('privacyPolicy'); }}>Privacy Policy</Link> and Official Rules.
                </Typography>
            </Box>
        </Container>
    );
};

export default LandingPage;
