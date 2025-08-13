import React from 'react';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Toolbar, Typography, Divider, Button, Stack
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function AdminLayout() {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Submissions', icon: <PeopleIcon />, path: '/admin/submissions' },
        { text: 'Generate Winner', icon: <EmojiEventsIcon />, path: '/admin/winner' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>Admin Panel</Typography>
                </Toolbar>
                <Divider />
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <List sx={{ flexGrow: 1 }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    sx={{
                                        '&.active': { color: 'primary.main', fontWeight: 700 },
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider />

                    <Stack sx={{ p: 2 }}>
                        <Button variant="outlined" color="error" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Stack>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
                <Toolbar /> {/* offsets the fixed Drawer toolbar */}
                <Outlet />
            </Box>
        </Box>
    );
}