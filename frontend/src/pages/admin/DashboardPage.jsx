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

const FALLBACK_COLORS = [
    '#EF4444', '#3B82F6', '#22C55E', '#F59E0B',
    '#8B5CF6', '#14B8A6', '#E11D48', '#6366F1',
];

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
                if (err.message.includes('Could not validate credentials')) {
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

    // Merge EN/AR emirate labels just in case
    const mergedEmirates = {};
    Object.entries(stats.submissions_by_emirate || {}).forEach(([rawName, count]) => {
        const key = normalizeEmirate(rawName);
        mergedEmirates[key] = (mergedEmirates[key] || 0) + (count || 0);
    });

    const emirateColorsMap = stats.emirate_colors || {};
    const emirateChartData = Object.entries(mergedEmirates).map(([name, submissions], idx) => ({
        name,
        submissions,
        color: emirateColorsMap[name] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
    }));

    const timeSeriesData = stats.submissions_over_time || []; // [{bucket, count}]
    const langEn = stats.submissions_by_language?.en ?? 0;
    const langAr = stats.submissions_by_language?.ar ?? 0;
    const peak = stats.peak_hour || null; // {hour_label, count}

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Dashboard
            </Typography>

            {/* Row 1: KPI cards */}
            <Grid container spacing={3}>
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
                        <Chip size="small"
                            label={`${((langEn / Math.max(1, (langEn + langAr))) * 100).toFixed(1)}%`}
                            sx={{ mt: 1 }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" color="text.secondary">Language: AR</Typography>
                        <Typography variant="h3" fontWeight="bold">{langAr.toLocaleString()}</Typography>
                        <Chip size="small"
                            label={`${((langAr / Math.max(1, (langEn + langAr))) * 100).toFixed(1)}%`}
                            sx={{ mt: 1 }}
                        />
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

            {/* Row 2: Emirates chart (own row, full-width) */}
            <Grid container spacing={3} sx={{ mt: 0 }}>
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
                                    {emirateChartData.map((e, i) => (
                                        <Cell key={`cell-${i}`} fill={e.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Row 3: Time series (own row, full-width) */}
            <Grid container spacing={3} sx={{ mt: 0 }}>
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