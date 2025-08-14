import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    AppBar, Box, Button, Container, Drawer,
    IconButton, List, ListItem, ListItemButton,
    ListItemText, Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
    const { i18n } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const dir = i18n.dir?.(i18n.language) || (i18n.language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language || 'en';
    }, [i18n.language, i18n]);

    const handleDrawerToggle = () => setMobileOpen(v => !v);
    const changeLanguage = (lng) => i18n.changeLanguage(lng);
    const navItems = [
        { label_en: 'HOME', label_ar: 'الرئيسية', path: '/' },
        { label_en: 'SUPERHEROES', label_ar: 'الأبطال', path: '/superheroes' },
        { label_en: 'TERMS & CONDITIONS', label_ar: 'الشروط والأحكام', path: '/terms' },
    ];

    const L = (en, ar) => (i18n.language === 'ar' ? (ar ?? en) : en);
    const lang = (en, ar) => (i18n.language === 'ar' ? (ar ?? en) : en);
    const asset = (path) => (i18n.language === 'ar' ? path.replace(/(\.\w+)$/, '_ar$1') : path);

    const navButtonStyles = {
        color: '#FFFFFF',
        fontFamily: 'Abdo Master, sans-serif',
        fontSize: { xs: '1rem', md: '1.2rem' },
        fontWeight: 'bold',
        textDecoration: 'none',
        '&.active': {
            textDecoration: 'none',
            color: 'yellow',
        },
        '&:hover': {
            textDecoration: 'none',
            color: 'yellow',
        },
    };

    const drawer = (
        <Box
            onClick={handleDrawerToggle}
            sx={{
                textAlign: 'center',
                bgcolor: '#df2328',
                height: '100%',
                direction: i18n.dir?.(i18n.language) || (i18n.language === 'ar' ? 'rtl' : 'ltr'),
            }}
        >
            <Typography variant="h6" sx={{ my: 2, color: 'white' }}>
                Al Ain Farms
            </Typography>
            <List onClick={(e) => e.stopPropagation()}>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            sx={{
                                textAlign: 'center',
                                ...navButtonStyles,
                                '& .MuiListItemText-primary': { ...navButtonStyles },
                            }}
                        >
                            <ListItemText
                                primaryTypographyProps={{ sx: navButtonStyles }}
                                primary={L(item.label_en, item.label_ar)}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar
                component="nav"
                position="static"
                sx={{ bgcolor: '#df2328', height: '80px', justifyContent: 'center', boxShadow: 'none' }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', height: '100%' }}>
                    <Box
                        onClick={() => navigate('/')}
                        sx={{
                            position: { xs: 'absolute', md: 'fixed' },
                            top: { xs: 8, md: -21 },
                            insetInlineStart: {
                                xs: i18n.language === 'ar' ? '25%' : '50%',
                                md: -28
                            },
                            transform: {
                                xs: i18n.language === 'ar' ? 'translateX(-25%)' : 'translateX(-50%)',
                                md: 'none'
                            },
                            width: { xs: 84, md: 180 },
                            height: { xs: 80, md: 140 },
                            bgcolor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                            zIndex: 1201,
                            cursor: 'pointer',
                        }}
                    >
                        <img
                            src={asset('/assets/logo.svg')}
                            alt="Al Ain Farms"
                            style={{ width: '60%', height: 'auto' }}
                        />
                    </Box>

                    <Toolbar sx={{ height: '100%' }}>
                        {/* Mobile hamburger */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, minWidth: '170px' }} />

                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 8 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.path}
                                    component={NavLink}
                                    to={item.path}
                                    sx={navButtonStyles}
                                >
                                    {L(item.label_en, item.label_ar)}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }} />
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                position: { xs: 'absolute', sm: 'relative' },
                                insetInlineEnd: { xs: 0, sm: 'auto' },
                            }}
                        >
                            <Button
                                onClick={() => changeLanguage('en')}
                                sx={{ ...navButtonStyles, color: i18n.language === 'en' ? 'yellow' : 'white' }}
                            >
                                EN
                            </Button>
                            <Typography sx={{ color: 'white' }}>|</Typography>
                            <Button
                                onClick={() => changeLanguage('ar')}
                                sx={{ ...navButtonStyles, color: i18n.language === 'ar' ? 'yellow' : 'white' }}
                            >
                                AR
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: '#df2328' },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Header;