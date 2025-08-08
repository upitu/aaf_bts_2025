import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardStats } from '../../services/api';

const DashboardPage = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError('');
                const data = await getDashboardStats(token);
                setStats(data);
            } catch (err) {
                setError(err.message || "Failed to fetch dashboard stats.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const chartData = stats ? Object.entries(stats.submissions_by_emirate).map(([name, value]) => ({ name, submissions: value })) : [];

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
    }
    
    if (error) {
        return <Alert severity="error">{error}</Alert>
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Total Submissions</Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary">{stats?.total_submissions.toLocaleString()}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                        <Typography variant="h6" mb={2}>Submissions by Emirate</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="submissions" fill="#5e35b1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
