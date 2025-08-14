import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { getSubmissionNames, generateWinner } from '../../services/api';

export default function WinnerPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const [allNames, setAllNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [displayedName, setDisplayedName] = useState('?');
    const [winner, setWinner] = useState(null);
    const [error, setError] = useState('');

    // Keep timer IDs to clear them on unmount/restart
    const fastIntervalRef = useRef(null);
    const slowIntervalRef = useRef(null);
    const endTimeoutRef = useRef(null);

    // Confetti size
    const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
    useEffect(() => {
        const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Load names
    const fetchNames = async () => {
        if (!token) {
            navigate('/admin/login', { replace: true });
            return;
        }
        try {
            setIsLoading(true);
            setError('');
            const names = await getSubmissionNames(token);
            if (!Array.isArray(names) || names.length === 0) {
                setError('There are no submissions to draw from.');
            }
            setAllNames(names || []);
        } catch (err) {
            const msg = String(err?.message || '');
            // Your api.js throws Error(detail) — match 401 or credential message
            if (msg.includes('401') || msg.toLowerCase().includes('validate credentials')) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login', { replace: true });
                return;
            }
            setError('Failed to load submissions.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNames();
        return () => {
            // cleanup on unmount
            if (fastIntervalRef.current) clearInterval(fastIntervalRef.current);
            if (slowIntervalRef.current) clearInterval(slowIntervalRef.current);
            if (endTimeoutRef.current) clearTimeout(endTimeoutRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearTimers = () => {
        if (fastIntervalRef.current) { clearInterval(fastIntervalRef.current); fastIntervalRef.current = null; }
        if (slowIntervalRef.current) { clearInterval(slowIntervalRef.current); slowIntervalRef.current = null; }
        if (endTimeoutRef.current) { clearTimeout(endTimeoutRef.current); endTimeoutRef.current = null; }
    };

    const startDraw = async () => {
        if (isDrawing || isLoading) return;
        if (!allNames || allNames.length < 2) {
            setError('You need at least two submissions to draw a winner.');
            return;
        }

        setIsDrawing(true);
        setWinner(null);
        setError('');
        clearTimers();

        // FAST shuffle for 3s
        fastIntervalRef.current = setInterval(() => {
            const idx = Math.floor(Math.random() * allNames.length);
            setDisplayedName(allNames[idx]);
        }, 75);

        // After 3s, stop fast shuffle, fetch official winner, then slow roll to it
        endTimeoutRef.current = setTimeout(async () => {
            if (fastIntervalRef.current) { clearInterval(fastIntervalRef.current); fastIntervalRef.current = null; }

            try {
                const officialWinner = await generateWinner(token); // expected: { name, email, mobile }
                const targetName = officialWinner?.name || '';

                // Build a short slow-roll sequence ending on the official winner
                const tail = [];
                for (let i = 0; i < 12; i++) {
                    const idx = Math.floor(Math.random() * allNames.length);
                    tail.push(allNames[idx]);
                }
                // Ensure last item is the winner
                tail[tail.length - 1] = targetName || allNames[0];

                let i = 0;
                slowIntervalRef.current = setInterval(() => {
                    setDisplayedName(tail[i]);
                    i++;
                    if (i >= tail.length) {
                        clearInterval(slowIntervalRef.current);
                        slowIntervalRef.current = null;
                        setWinner({
                            name: officialWinner?.name || tail[tail.length - 1],
                            email: officialWinner?.email || '',
                            mobile: officialWinner?.mobile || '',
                        });
                        setIsDrawing(false);
                    }
                }, 260);
            } catch (err) {
                const msg = String(err?.message || '');
                if (msg.includes('401') || msg.toLowerCase().includes('validate credentials')) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login', { replace: true });
                    return;
                }
                setError(err?.message || 'Failed to draw a winner.');
                setIsDrawing(false);
            }
        }, 3000);
    };

    const confettiActive = useMemo(() => Boolean(winner && winner.name), [winner]);

    return (
        <Box>
            {confettiActive && (
                <Confetti
                    width={viewport.w}
                    height={viewport.h}
                    numberOfPieces={400}
                    recycle={false}
                />
            )}

            <Typography variant="h4" gutterBottom fontWeight="bold">
                Generate a Winner
            </Typography>

            <Paper sx={{ p: 4, mt: 3, textAlign: 'center', borderRadius: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    And the winner is...
                </Typography>

                <Box
                    sx={{
                        my: 4,
                        p: 3,
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        minHeight: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h2" fontWeight="bold" color="primary" sx={{ wordBreak: 'break-word' }}>
                        {winner ? winner.name : displayedName}
                    </Typography>
                </Box>

                {winner && (
                    <Box mb={3}>
                        <Typography variant="h6">Congratulations!</Typography>
                        {winner.email && <Typography color="text.secondary">Email: {winner.email}</Typography>}
                        {winner.mobile && <Typography color="text.secondary">Mobile: {winner.mobile}</Typography>}
                    </Box>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Button
                    variant="contained"
                    size="large"
                    onClick={startDraw}
                    disabled={isDrawing || isLoading || allNames.length === 0}
                    sx={{ minWidth: '220px', py: 1.5 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : (isDrawing ? 'Drawing...' : 'Start the Draw')}
                </Button>
            </Paper>
        </Box>
    );
}