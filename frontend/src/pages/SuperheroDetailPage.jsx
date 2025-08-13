// SuperheroDetailPage.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Stack, useMediaQuery } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { superheroesData } from '../superheroData';
import { useTheme } from '@mui/material/styles';

const InfoBox = ({ bgImage, rotate = 0, sx: sxProp = {} }) => (
    <Box
        role="region"
        sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            minHeight: { xs: 110, md: 200 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'black',
            fontFamily: 'Abdo Master, sans-serif',
            fontWeight: 700,
            lineHeight: 1.25,
            transform: { xs: 'none', md: `rotate(${rotate}deg)` },
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,.22))',

            /** MOBILE: updated width & alignment */
            width: { xs: '57%', md: '100%' },
            alignSelf: { xs: 'flex-start', md: 'stretch' },
            ml: { xs: 0, md: 0 },
            mr: { xs: 'auto', md: 0 },
            px: { xs: 0, md: 0 },
            pt: { xs: 1.25, md: '2rem' },

            ...sxProp,
        }}
    >
        <Typography className="abdo-font" dir="auto" sx={{ whiteSpace: 'pre-line' }} />
    </Box>
);

export default function SuperheroDetailPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { heroName } = useParams();
    const navigate = useNavigate();
    const hero = superheroesData[heroName];
    const nameAlt = useMemo(() => `${hero?.name ?? ''} name bubble`, [hero]);

    if (!hero) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
                <Header />
                <Typography variant="h4" align="center" sx={{ mt: 5 }}>
                    Superhero not found!
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
            <Header />

            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: `url(${hero.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: 0,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch',
                    position: 'relative',
                }}
            >
                {/* LEFT: Info bubbles */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '30%' },
                        maxWidth: { md: 400 },
                        px: { xs: 0, md: 0 },
                        zIndex: 3,
                        mb: { xs: 3, md: 0 },
                        pt: { xs: 1, md: '10rem' },
                    }}
                >
                    <Stack
                        spacing={{ xs: 1.2, md: 3 }}
                        sx={{
                            alignItems: { xs: 'flex-start', md: 'stretch' },
                        }}
                    >
                        <InfoBox bgImage={hero.bgs.corePower} rotate={-2} />
                        <InfoBox bgImage={hero.bgs.mission} rotate={1.5} />
                        <InfoBox bgImage={hero.bgs.personality} rotate={-1} />
                    </Stack>
                </Box>

                {/* RIGHT: hero images */}
                <Box
                    sx={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        minHeight: { xs: 560, md: 680 },
                        zIndex: 2,
                    }}
                >
                    {/* Superhero image */}
                    <Box
                        component="img"
                        src={hero.image}
                        alt={`${hero.name} superhero`}
                        loading="eager"
                        draggable={false}
                        sx={{
                            position: 'absolute',
                            right: { xs: '2%', md: 0 },
                            bottom: 0,
                            width: { 
                                xs: heroName?.toLowerCase() === 'hazem' ? '53%' : '63%',
                                md: heroName?.toLowerCase() === 'hazem' ? '30%' : '45%',
                            },
                            maxWidth: { xs: 520, md: 520 },
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.28))',
                            userSelect: 'none',
                            zIndex: 10,
                        }}
                    />

                    {/* Name bubble */}
                    <Box
                        component="img"
                        src={hero.nameBubble}
                        alt={nameAlt}
                        loading="eager"
                        sx={{
                            position: 'absolute',
                            top: { xs: '2%', md: '10%' },
                            left: { xs: '27%', md: '50%' },
                            transform: { xs: 'none', md: 'translateX(-50%)' },
                            width: { xs: '45%', md: '36%' },
                            maxWidth: { xs: 380, md: 520 },
                            zIndex: 4,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Product image */}
                    <Box
                        component="img"
                        src={hero.productImage}
                        alt={`${hero.name} featured product`}
                        loading="lazy"
                        sx={{
                            position: 'absolute',
                            bottom: { xs: '1%', md: '8%' },
                            left: { xs: '20%', md: '46%' },
                            transform: 'translateX(-50%)',
                            height: { xs: '30%', md: '45%' },
                            zIndex: 3,
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.25))',
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}