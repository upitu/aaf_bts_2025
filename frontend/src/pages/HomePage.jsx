import React from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import registerBtn from '../../public/assets/register.svg'
import registerBtnAr from '../../public/assets/register_ar.svg';

const assetForLang = (path, lang) =>
    lang === 'ar' && typeof path === 'string'
        ? path.replace(/(\.\w+)$/, '_ar$1')
        : path;

const TEXT = {
    title: {
        en: 'Every Pack Unlocks a Superpower',
        ar: 'كل عبوة تكشف عن قوة خارقة',
    },
    registerBtn: {
        en: 'Register\nTO ENTER THE DRAW',
        ar: 'سجّل\nللدخول في السحب',
    },
    prize1: {
        en: '3 Family Trips To Universal Studios Japan',
        ar: '٣ رحلات عائلية إلى يونيفرسال ستوديوز اليابان',
    },
    prize2: {
        en: '10 Staycations in Warner Bros Abu Dhabi',
        ar: 'عشر رحلات إلى عالم وارنر براذرز أبوظبي',
    },
    prize3: {
        en: '100 Branded Items (50 Headsets & 50 Kids Hoodies)',
        ar: 'مئات الهدايا المخصصة (50 هوديز للأطفال و50 سماعة رأس)',
    },
    terms: {
        en: 'Terms & Conditions Apply',
        ar: 'تُطبّق الشروط والأحكام',
    },
};

const PrizeBox = ({ bgColor, children }) => (
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
            width: { xs: '90%', sm: '60%', md: '30%' },
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            mt: '20px',
            border: '5px solid black',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: `20px solid ${bgColor}`,
            },
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
            },
        }}
    >
        {children}
    </Box>
);

export default function HomePage() {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const lang = i18n.language || 'en';
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Assets that have AR variants available should be listed here
    const hero2 = assetForLang('/assets/superhero2.svg', lang);
    const hero1 = assetForLang('/assets/superhero1.svg', lang);
    const hero3 = assetForLang('/assets/superhero3.svg', lang);
    const hero4 = assetForLang('/assets/superhero4.svg', lang);
    const bg = assetForLang('/assets/bg.svg', lang);
    const unboxTitle = assetForLang('/assets/unbox.png', lang);
    const arrowImg = assetForLang('/assets/arrow.svg', lang);

    // Logical positioning: insetInlineStart/End flips automatically with dir
    const floatCommon = {
        position: 'absolute',
        bottom: '5%',
        width: { xs: '100px', md: '220px' },
        display: { xs: 'none', md: 'block' },
    };

    return (
        <>
            <Header />
            <Box
                dir={dir}
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 2,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src={hero2}
                    className="superhero-float"
                    sx={{
                        ...floatCommon,
                        insetInlineStart: { md: '18%' },
                        transformOrigin: 'center',
                        animationDelay: '1.5s',
                    }}
                />
                <Box
                    component="img"
                    src={hero1}
                    className="superhero-float"
                    sx={{
                        ...floatCommon,
                        insetInlineStart: { md: '5%' },
                        animationDelay: '0s',
                    }}
                />
                <Box
                    component="img"
                    src={hero3}
                    className="superhero-float"
                    sx={{
                        ...floatCommon,
                        insetInlineEnd: { md: '18%' },
                        animationDelay: '0.5s',
                    }}
                />
                <Box
                    component="img"
                    src={hero4}
                    className="superhero-float"
                    sx={{
                        ...floatCommon,
                        insetInlineEnd: { md: '5%' },
                        animationDelay: '2s',
                    }}
                />

                <Container maxWidth="md" sx={{ zIndex: 1 }}>
                    <Stack spacing={2} alignItems="center">
                        <Box
                            component="img"
                            src={unboxTitle}
                            alt={lang === 'ar' ? 'افتح قواك الخارقة' : 'Unbox Your Superpowers'}
                            className="title-pulse"
                            sx={{ width: { xs: '90%', sm: '80%', md: '600px' }, mb: -2 }}
                        />
                        <Typography
                            className="abdo-font"
                            sx={{ fontSize: { xs: '18pt', md: '25pt' }, color: '#000000', whiteSpace: 'pre-line' }}
                        >
                            {TEXT.title[lang]}
                        </Typography>

                        <Box sx={{ position: 'relative', mt: 2 }}>
                            <Button
                                onClick={() => navigate('/registration')}
                                sx={{
                                    backgroundImage: `url(${lang === 'ar' ? registerBtnAr : registerBtn})`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: 120,
                                    width: 450,
                                    p: 0,
                                    minWidth: 'unset',
                                    bgcolor: 'transparent',
                                    border: 'none',
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: 'transparent' },
                                }}
                            >
                            </Button>
                        </Box>

                        <Stack spacing={1.5} alignItems="center" mt={3} width="100%">
                            <PrizeBox bgColor="#007db5">{TEXT.prize1[lang]}</PrizeBox>
                            <PrizeBox bgColor="#d92726">{TEXT.prize2[lang]}</PrizeBox>
                            <PrizeBox bgColor="#007db5">{TEXT.prize3[lang]}</PrizeBox>
                        </Stack>

                        <Typography
                            className="abdo-font"
                            sx={{ fontSize: { xs: '18pt', md: '25pt' }, color: '#000000' }}
                        >
                            {TEXT.terms[lang]}
                        </Typography>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}