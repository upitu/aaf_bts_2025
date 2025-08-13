import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

// Data for the superheroes.
const superheroes = [
    { name: 'Bariqa', image: '/assets/superhero2.svg', nameBubble: '/assets/bariqa-name.svg', bgImage: '/assets/bariqa-bg.svg' },
    { name: 'Zakki', image: '/assets/superhero4.svg', nameBubble: '/assets/zakki-name.svg', bgImage: '/assets/zakki-bg.svg' },
    { name: 'Zayen', image: '/assets/superhero3.svg', nameBubble: '/assets/zayen-name.svg', bgImage: '/assets/zayen-bg.svg' },
    { name: 'Hazem', image: '/assets/superhero1.svg', nameBubble: '/assets/hazem-name.svg', bgImage: '/assets/hazem-bg.svg' },
];

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
                border: '10px solid #000000'
            }}
        >
            <Box 
                className="background-animator"
                sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${hero.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: 'circular-zoom-pan 25s ease-in-out infinite',
                }}
            />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
                pb: 4,
            }}>
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
                        width: {xs: '70%', sm: '80%', md: '90%'},
                        maxWidth: '300px',
                    }}
                />
            </Box>
        </Box>
    );
};

const SuperheroesPage = ({ }) => {
    const navigate = useNavigate();
    return (
        <Box>
            <Header />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                {superheroes.map((hero) => (
                    <SuperheroCard key={hero.name} hero={hero} navigate={navigate} />
                ))}
            </Box>
        </Box>
    );
};

export default SuperheroesPage;
