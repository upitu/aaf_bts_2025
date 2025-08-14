import React, { useMemo } from 'react';
import { Box, Typography, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { superheroesData } from '../superheroData';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const DESKTOP_CALIBRATION = {
    en: {
        bariqa: { nameLeft: 50, productLeft: 46 },
        hazem: { nameLeft: 50, productLeft: 47 },
        zakki: { nameLeft: 50, productLeft: 45 },
        zayen: { nameLeft: 50, productLeft: 46 },
        default: { nameLeft: 50, productLeft: 46 },
    },
    ar: {
        bariqa: { nameLeft: 58, productLeft: 41 },
        hazem: { nameLeft: 58, productLeft: 42 },
        zakki: { nameLeft: 58, productLeft: 40 },
        zayen: { nameLeft: 58, productLeft: 41 },
        default: { nameLeft: 58, productLeft: 41 },
    },
};

const getDesktopPos = (heroKey, lang = 'en') => {
    const group = DESKTOP_CALIBRATION[lang] || DESKTOP_CALIBRATION.en;
    return group[heroKey] || group.default;
};

const assetForLang = (path, lang) =>
    lang === 'ar' && typeof path === 'string'
        ? path.replace(/(\.\w+)$/, '_ar$1')
        : path;

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
    const { i18n } = useTranslation();
    const lang = (i18n.language || 'en').startsWith('ar') ? 'ar' : 'en';
    const heroBase = superheroesData[heroName];
    const hero = heroBase
        ? {
            ...heroBase,
            image: assetForLang(heroBase.image, lang),
            nameBubble: assetForLang(heroBase.nameBubble, lang),
            productImage: assetForLang(heroBase.productImage, lang),
            bgImage: assetForLang(heroBase.bgImage, lang),
            bgs: {
                ...(heroBase.bgs || {}),
                corePower: assetForLang(heroBase.bgs?.corePower, lang),
                mission: assetForLang(heroBase.bgs?.mission, lang),
                personality: assetForLang(heroBase.bgs?.personality, lang),
            },
        }
        : null;

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

    const key = heroName?.toLowerCase();
    const desk = getDesktopPos(key, lang);
    const mobileName = { top: '2%', insetInlineStart: '27%', width: '45%' };
    const mobileProduct = {
        bottom: '1%',
        insetInlineStart:
            lang === 'ar' && key === 'bariqa' ? '-15%' : '20%',
        height: '30%',
    };

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
                    <Stack spacing={{ xs: 1.2, md: 3 }} sx={{ alignItems: { xs: 'flex-start', md: 'stretch' } }}>
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
                            insetInlineEnd: { xs: '2%', md: 0 }, // logical end → mirrors in RTL
                            bottom: 0,
                            width: {
                                xs: key === 'hazem' ? '53%' : '63%',
                                md: key === 'hazem' ? '30%' : '45%',
                            },
                            maxWidth: 520,
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.28))',
                            userSelect: 'none',
                            zIndex: 10,
                            display: 'block',
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
                            zIndex: 4,
                            pointerEvents: 'none',
                            maxWidth: { xs: 380, md: 520 },
                            display: 'block',
                            top: { xs: mobileName.top, md: '10%' },
                            insetInlineStart: { xs: mobileName.insetInlineStart, md: 'unset' },
                            left: { xs: 'unset', md: `${desk.nameLeft}%` },
                            transform: { xs: 'none', md: 'translateX(-50%)' },
                            width: { xs: mobileName.width, md: '36%' },
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
                            zIndex: 3,
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.25))',
                            display: 'block',
                            bottom: { xs: mobileProduct.bottom, md: '8%' },
                            insetInlineStart: { xs: mobileProduct.insetInlineStart, md: 'unset' },
                            left: { xs: 'unset', md: `${desk.productLeft}%` },
                            transform: 'translateX(-50%)',
                            height: { xs: mobileProduct.height, md: '45%' },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}