// src/pages/admin/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Paper, CircularProgress, Alert, Chip, Stack
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, Cell
} from 'recharts';
import { getDashboardStats } from '../../services/api';
import { normalizeEmirate } from '../../utils/emirate';

const DashboardPage = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setError('');
                const storedToken = token || localStorage.getItem('adminToken');
                const data = await getDashboardStats(storedToken);
                setStats(data);
            } catch (err) {
                if ((err?.message || '').includes('Could not validate credentials')) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/login';
                    return;
                }
                setError(err.message || 'Failed to fetch dashboard stats.');
            } finally {
                setLoading(false);
            }
        })();
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

    // ---------- Derive/chart data safely ----------
    const total = stats.total_submissions ?? 0;

    // Normalize emirate names on the client just in case,
    // then fold into an array for the chart.
    const mergedEmirates = {};
    Object.entries(stats.submissions_by_emirate || {}).forEach(([raw, count]) => {
        const key = normalizeEmirate(raw);
        mergedEmirates[key] = (mergedEmirates[key] || 0) + (count || 0);
    });
    const emirateChartData = Object.entries(mergedEmirates).map(([name, submissions]) => ({
        name,
        submissions,
    }));
    const emirateColors = stats.emirate_colors || {};

    // Language breakdown
    const langEn = stats.submissions_by_language?.en ?? 0;
    const langAr = stats.submissions_by_language?.ar ?? 0;
    const langTotal = Math.max(1, langEn + langAr);
    const pct = (n) => `${((n / langTotal) * 100).toFixed(1)}%`;

    // Time series
    const timeSeriesData = Array.isArray(stats.submissions_over_time)
        ? stats.submissions_over_time
        : [];

    // Peak hour
    const peak = stats.peak_hour || null;

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
                            {total.toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Language: EN</Typography>
                        <Typography variant="h3" fontWeight="bold">{langEn.toLocaleString()}</Typography>
                        <Chip size="small" label={pct(langEn)} sx={{ mt: 1 }} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Language: AR</Typography>
                        <Typography variant="h3" fontWeight="bold">{langAr.toLocaleString()}</Typography>
                        <Chip size="small" label={pct(langAr)} sx={{ mt: 1 }} />
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
            </Grid>
            {/* ---- Separate full-width row: Submissions by Emirate ---- */}
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
                            <Bar dataKey="submissions">
                                {emirateChartData.map((row, i) => (
                                    <Cell key={`bar-${row.name}-${i}`} fill={emirateColors[row.name] || '#4760c4'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>
        </Box>
    );
};

export default DashboardPage;