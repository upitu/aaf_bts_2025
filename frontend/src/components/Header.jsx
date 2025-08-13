import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    AppBar, Box, Button, Container, Drawer,
    IconButton, List, ListItem, ListItemButton,
    ListItemText, Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate(); // for logo click if you want

    const handleDrawerToggle = () => setMobileOpen((v) => !v);
    const closeDrawerAnd = (to) => () => { setMobileOpen(false); navigate(to); };

    const changeLanguage = (lng) => i18n.changeLanguage(lng);

    const navItems = [
        { label: 'HOME', path: '/' },
        { label: 'SUPERHEROES', path: '/superheroes' },
        { label: 'TERMS & CONDITIONS', path: '/terms' },
    ];

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
        '&.hover': {
            textDecoration: 'none',
            color: 'yellow',
        },
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', bgcolor: '#df2328', height: '100%' }}>
            <Typography variant="h6" sx={{ my: 2, color: 'white' }}>
                Al Ain Farms
            </Typography>
            <List onClick={(e) => e.stopPropagation()}>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
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
                            <ListItemText primaryTypographyProps={{ sx: navButtonStyles }} primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box>
            <AppBar component="nav" position="static" sx={{ bgcolor: '#df2328', height: '80px', justifyContent: 'center', boxShadow: 'none' }}>
                <Container maxWidth="lg" sx={{ position: 'relative', height: '100%' }}>
                    {/* Logo bubble */}
                    <Box
                        onClick={() => navigate('/')}
                        sx={{
                            position: { xs: 'absolute', md: 'fixed' },
                            top: { xs: 8, md: '-21px' },
                            left: { xs: '50%', md: '-28px' },
                            transform: { xs: 'translateX(-50%)', md: 'none' },
                            width: { xs: 84, md: 180 },
                            height: { xs: '80px', sm: '140px' },
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
                            src="/assets/logo.svg" 
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

                        {/* Spacer under logo on desktop */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, minWidth: '170px' }} />

                        {/* Desktop nav */}
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 20 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={NavLink}
                                    to={item.path}
                                    sx={navButtonStyles}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Spacer for right side on mobile */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }} />

                        {/* Language toggles */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                position: { xs: 'absolute', sm: 'relative' },
                                right: { xs: 0, sm: 'auto' }
                            }}
                        >
                            <Button onClick={() => changeLanguage('en')} sx={{ ...navButtonStyles, color: i18n.language === 'en' ? 'yellow' : 'white' }}>EN</Button>
                            <Typography sx={{ color: 'white' }}>|</Typography>
                            <Button onClick={() => changeLanguage('ar')} sx={{ ...navButtonStyles, color: i18n.language === 'ar' ? 'yellow' : 'white' }}>AR</Button>
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