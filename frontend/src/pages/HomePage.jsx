import React from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

// Reusable component for the prize boxes with CSS arrows
const PrizeBox = ({ bgColor, children }) => {
    return (
        <Box
            sx={{
                position: 'relative',
                bgcolor: bgColor,
                color: 'white',
                fontFamily: 'Abdo Master, sans-serif',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRadius: '16px',
                padding: '12px 24px',
                width: { xs: '90%', sm: '70%', md: '50%' },
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                mt: '20px', // Margin to make space for the arrow
                border: '5px solid black',
                // CSS arrow
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px', // Position arrow above the box
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '20px solid transparent',
                    borderRight: '20px solid transparent',
                    borderBottom: `20px solid ${bgColor}`,
                },
                 // Black border for the arrow
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-26px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '22px solid transparent',
                    borderRight: '22px solid transparent',
                    borderBottom: '22px solid black',
                    zIndex: -1,
                }
            }}
        >
            {children}
        </Box>
    );
};

const HomePage = ({  }) => {
    const navigate = useNavigate();
    return (
        <>
            <Header />
            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: 'url(/assets/bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 2,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated Superheroes */}
                <Box component="img" src="/assets/superhero2.svg" className="superhero-float" 
                    sx={{ 
                        position: 'absolute', 
                        bottom: '5%', 
                        left: { xs: '30%', md: '18%' }, 
                        width: { xs: '100px', md: '220px' }, 
                        animationDelay: '1.5s',
                        display: { xs: 'none', md: 'block' }
                    }} 
                />
                <Box component="img" src="/assets/superhero1.svg" className="superhero-float" 
                    sx={{ 
                        position: 'absolute', 
                        bottom: '5%', 
                        left: '5%', 
                        width: { xs: '100px', md: '220px' }, 
                        animationDelay: '0s',
                        display: { xs: 'none', md: 'block' }
                    }} 
                />
                <Box component="img" src="/assets/superhero3.svg" className="superhero-float" 
                    sx={{ 
                        position: 'absolute', 
                        bottom: '5%', 
                        right: { xs: '30%', md: '18%' }, 
                        width: { xs: '100px', md: '220px' }, 
                        animationDelay: '0.5s',
                        display: { xs: 'none', md: 'block' }
                    }} 
                />
                <Box component="img" src="/assets/superhero4.svg" className="superhero-float" 
                    sx={{ 
                        position: 'absolute', 
                        bottom: '5%', 
                        right: '5%', 
                        width: { xs: '100px', md: '220px' }, 
                        animationDelay: '2s',
                        display: { xs: 'none', md: 'block' }
                    }} 
                />

                <Container maxWidth="md" sx={{ zIndex: 1 }}>
                    <Stack spacing={2} alignItems="center">
                        <Box component="img" src="/assets/unbox.png" alt="Unbox Your Superpowers" className="title-pulse" sx={{ width: { xs: '90%', sm: '80%', md: '600px' }, mb: -2 }} />
                        <Typography className="abdo-font" sx={{ fontSize: { xs: '18pt', md: '25pt' }, color: '#000000' }}>
                            Every Pack Unlocks a Superpower
                        </Typography>
                        
                        {/* Container for the button and its arrow */}
                        <Box sx={{ position: 'relative', mt: 2 }}>
                            <Box
                                component="img"
                                src="/assets/arrow.svg" // Corrected to SVG
                                sx={{
                                    position: 'absolute',
                                    width: { xs: '50px', md: '60px' },
                                    // Corrected positioning
                                    top: '50%', 
                                    left: '5%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10
                                }}
                            />
                            <Button
                                onClick={() => navigate('/registration')}
                                sx={{
                                    bgcolor: '#d92726',
                                    color: 'white',
                                    borderRadius: '20px',
                                    border: '10px solid black',
                                    fontWeight: 'bold',
                                    fontFamily: 'Abdo Master, sans-serif',
                                    fontSize: { xs: '1rem', md: '1.5rem' },
                                    px: { xs: 4, md: 6 },
                                    py: { xs: 1, md: 1.5 },
                                    lineHeight: 1.2,
                                    '&:hover': { bgcolor: '#c62828' }
                                }}
                            >
                                Register <br /> TO ENTER THE DRAW
                            </Button>
                        </Box>
                        
                        <Stack spacing={1.5} alignItems="center" mt={3} width="100%">
                            <PrizeBox bgColor="#007db5">
                                3 Family Trips To Universal Studios Japan
                            </PrizeBox>
                            <PrizeBox bgColor="#d92726">
                                10 Staycations in Warner Bros Abu Dhabi
                            </PrizeBox>
                            <PrizeBox bgColor="#007db5">
                                100 Branded Items (50 Headsets & 50 Kids Hoodies)
                            </PrizeBox>
                        </Stack>
                        <Typography className="abdo-font" sx={{ fontSize: { xs: '18pt', md: '25pt' }, color: '#000000' }}>
                            Terms & Conditions Apply
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default HomePage;
