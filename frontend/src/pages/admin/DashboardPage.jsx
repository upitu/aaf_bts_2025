import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, CircularProgress, Alert, Chip, Stack
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line
} from 'recharts';
import { getDashboardStats } from '../../services/api';
import { normalizeEmirate } from '../../utils/emirate';

const DashboardPage = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError('');
                const storedToken = token || localStorage.getItem('adminToken');
                const data = await getDashboardStats(storedToken);
                setStats(data);
            } catch (err) {
                if (err.message.includes('Could not validate credentials')) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/login';
                    return;
                }
                setError(err.message || 'Failed to fetch dashboard stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!stats) return null;

    // ---- Emirate chart (force-normalize on the client, just in case) ----
    // stats.submissions_by_emirate: { "Dubai": 10, "دبي": 3, ... }
    const mergedEmirates = {};
    Object.entries(stats.submissions_by_emirate || {}).forEach(([rawName, count]) => {
        const key = normalizeEmirate(rawName);
        mergedEmirates[key] = (mergedEmirates[key] || 0) + (count || 0);
    });
    const emirateChartData = Object.entries(mergedEmirates).map(([name, submissions]) => ({
        name,
        submissions,
    }));

    // ---- Time series (hourly/daily buckets) ----
    // Expect: [{ bucket: '2025-08-15 14:00', count: 5 }, ...]
    const timeSeriesData = stats.submissions_over_time || [];

    // ---- Language counts ----
    // Expect: { en: number, ar: number }
    const langEn = stats.submissions_by_language?.en ?? 0;
    const langAr = stats.submissions_by_language?.ar ?? 0;

    // ---- Peak hour (optional) ----
    const peak = stats.peak_hour || null; // { hour_label: '14:00', count: 23 }

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Dashboard
            </Typography>

            <Grid container spacing={3}>
                {/* KPI Cards */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Total Submissions</Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary">
                            {(stats.total_submissions ?? 0).toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Language: EN</Typography>
                        <Typography variant="h3" fontWeight="bold">{langEn.toLocaleString()}</Typography>
                        <Chip size="small" label={`${((langEn / Math.max(1, (langEn + langAr))) * 100).toFixed(1)}%`} sx={{ mt: 1 }} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Language: AR</Typography>
                        <Typography variant="h3" fontWeight="bold">{langAr.toLocaleString()}</Typography>
                        <Chip size="small" label={`${((langAr / Math.max(1, (langEn + langAr))) * 100).toFixed(1)}%`} sx={{ mt: 1 }} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Peak Hour</Typography>
                        {peak ? (
                            <Stack alignItems="center">
                                <Typography variant="h3" fontWeight="bold">{peak.count}</Typography>
                                <Typography variant="body2" color="text.secondary">{peak.hour_label}</Typography>
                            </Stack>
                        ) : (
                            <Typography variant="h5" fontWeight="bold">—</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Submissions by Emirate (bigger) */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: 520 }}>
                        <Typography variant="h6" mb={2}>Submissions by Emirate</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={emirateChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" interval={0} dy={8} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="submissions" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Submissions Over Time */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: 420 }}>
                        <Typography variant="h6" mb={2}>Submissions Over Time</Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="bucket" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;