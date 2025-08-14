import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

// Base (EN) data for the superheroes.
// We will derive AR asset paths by swapping to *_ar.ext via the asset() helper.
const superheroesBase = [
    { name: 'Bariqa', image: '/assets/superhero2.svg', nameBubble: '/assets/bariqa-name.svg', bgImage: '/assets/bariqa-bg.svg' },
    { name: 'Zakki', image: '/assets/superhero4.svg', nameBubble: '/assets/zakki-name.svg', bgImage: '/assets/zakki-bg.svg' },
    { name: 'Zayen', image: '/assets/superhero3.svg', nameBubble: '/assets/zayen-name.svg', bgImage: '/assets/zayen-bg.svg' },
    { name: 'Hazem', image: '/assets/superhero1.svg', nameBubble: '/assets/hazem-name.svg', bgImage: '/assets/hazem-bg.svg' },
];

// Helper: if lang is ar, turn "/path/file.svg" into "/path/file_ar.svg"
const assetForLang = (path, lang) =>
    lang === 'ar' ? path.replace(/(\.\w+)$/, '_ar$1') : path;

const SuperheroCard = ({ hero, navigate }) => {
    return (
        <Box
            onClick={() => navigate(`/superhero/${hero.name.toLowerCase()}`)}
            sx={{
                flex: { sm: 1 },
                width: { xs: '100%', sm: 'auto' },
                height: { xs: '85vh', sm: 'calc(100vh - 80px)' },
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                border: '10px solid #000000',
            }}
        >
            <Box
                className="background-animator"
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${hero.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: 'circular-zoom-pan 25s ease-in-out infinite',
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative',
                    pb: 4,
                }}
            >
                <Box
                    component="img"
                    src={hero.nameBubble}
                    alt={`${hero.name} name`}
                    sx={{
                        position: 'absolute',
                        top: '5%',
                        width: '60%',
                        maxWidth: '350px',
                    }}
                />
                <Box
                    component="img"
                    src={hero.image}
                    alt={hero.name}
                    sx={{
                        width: { xs: '70%', sm: '80%', md: '90%' },
                        maxWidth: '300px',
                    }}
                />
            </Box>
        </Box>
    );
};

const SuperheroesPage = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language || 'en';

    // Build the per-language assets on the fly (no JSON file)
    const superheroes = superheroesBase.map((h) => ({
        ...h,
        image: assetForLang(h.image, lang),
        nameBubble: assetForLang(h.nameBubble, lang),
        bgImage: assetForLang(h.bgImage, lang),
    }));

    return (
        <Box>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {
                        xs: 'column',                // stacked on mobile
                        sm: lang === 'ar' ? 'row-reverse' : 'row', // mirror left/right on desktop
                    },
                }}
            >
                {superheroes.map((hero) => (
                    <SuperheroCard key={hero.name} hero={hero} navigate={navigate} />
                ))}
            </Box>
        </Box>
    );
};

export default SuperheroesPage;