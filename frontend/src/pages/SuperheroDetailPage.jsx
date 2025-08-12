import React, { useMemo } from 'react';
import { Box, Container, Typography, Stack, useMediaQuery } from '@mui/material';
import Header from '../components/Header';

const InfoBox = ({ title, text, bgImage, rotate = 0 }) => (
    <Box
        role="region"
        aria-label={title}
        sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            p: { xs: 2.5, md: 4 },
            minHeight: { xs: 120, md: 140 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'black',
            fontFamily: 'Abdo Master, sans-serif',
            fontWeight: 700,
            lineHeight: 1.25,
            transform: { xs: 'none', md: `rotate(${rotate}deg)` },
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.22))',
            pl: { xs: 5, md: '5rem' },
        }}
    >
        <Typography variant="h6" className="abdo-font" sx={{ mb: 0.5 }}>
            {title}:
        </Typography>
        <Typography
            className="abdo-font"
            dir="auto"
            sx={{
                whiteSpace: 'pre-line',
                fontSize: { xs: 14, md: 16 },
                p: { xs: 2.5, md: '0rem' },
            }}
        >
            {text}
        </Typography>
    </Box>
);

const SuperheroDetailPage = ({ hero, navigate }) => {
    const nameAlt = useMemo(() => `${hero?.name ?? ''} name bubble`, [hero]);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const missionTitle = hero?.name === 'Bariqa' ? 'Her Mission' : 'His Mission';

    if (!hero) {
        return (
            <Box>
                <Header navigateTo={navigate} />
                <Typography variant="h4" align="center" sx={{ mt: 5 }}>
                    Superhero not found!
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Header navigate={navigate} />

            {/* Background section */}
            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: `url(${hero.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                }}
            >
                {/* Left Column - Info Boxes */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '30%' },
                        maxWidth: { md: 400 },
                        px: { xs: 2, md: 0 },
                        zIndex: 3,
                        mb: { xs: 4, md: 0 },
                    }}
                >
                    <Stack spacing={{ xs: 2.2, md: 3 }}>
                        <InfoBox
                            title="Core Power"
                            text={hero.corePowerDescription}
                            bgImage={hero.bgs.corePower}
                            rotate={-2}
                        />
                        <InfoBox
                            title={missionTitle}
                            text={hero.mission}
                            bgImage={hero.bgs.mission}
                            rotate={1.5}
                        />
                        <InfoBox
                            title="Personality traits"
                            text={hero.personality}
                            bgImage={hero.bgs.personality}
                            rotate={-1}
                        />
                    </Stack>
                </Box>

                {/* Right Column - Hero Content */}
                <Box
                    sx={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: { xs: 500, md: 680 },
                        zIndex: 2,
                    }}
                >
                    <Container 
                        maxWidth="xl" 
                        sx={{ 
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Superhero Image */}
                        <Box
                            component="img"
                            src={hero.image}
                            alt={`${hero.name} superhero`}
                            loading="eager"
                            draggable={false}
                            sx={{
                                position: 'absolute',
                                right: { xs: '1%', md: 0 },
                                bottom: 0,
                                width: { xs: '64%', md: '40%' },
                                maxWidth: { xs: 460, md: 520 },
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.28))',
                                userSelect: 'none',
                                zIndex: 10,
                            }}
                        />

                        {/* Name Bubble */}
                        <Box
                            component="img"
                            src={hero.nameBubble}
                            alt={nameAlt}
                            loading="eager"
                            sx={{
                                position: 'absolute',
                                top: { xs: '5%', md: '10%' },
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: { xs: '70%', md: '36%' },
                                maxWidth: { xs: 440, md: 520 },
                                zIndex: 4,
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Product Image */}
                        <Box
                            component="img"
                            src={hero.productImage}
                            alt={`${hero.name} featured product`}
                            loading="lazy"
                            sx={{
                                position: 'absolute',
                                bottom: { xs: '6%', md: '8%' },
                                left: { xs: '42%', md: '46%' },
                                transform: 'translateX(-50%)',
                                // width: { xs: '50%', md: '45%' },
                                height: { xs: '50%', md: '45%' },
                                // maxWidth: 260,
                                zIndex: 3,
                                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.25))',
                            }}
                        />
                    </Container>
                </Box>
            </Box>
        </Box>
    );
};

export default SuperheroDetailPage;