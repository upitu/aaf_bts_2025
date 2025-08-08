import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import Confetti from 'react-confetti';
import { getSubmissionNames, generateWinner } from '../../services/api';

const WinnerPage = ({ token }) => {
    const [allNames, setAllNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [displayedName, setDisplayedName] = useState('?');
    const [winner, setWinner] = useState(null);
    const [error, setError] = useState('');

    // Fetch all names when the component loads
    useEffect(() => {
        const fetchNames = async () => {
            try {
                const names = await getSubmissionNames(token);
                if (names.length === 0) {
                    setError('There are no submissions to draw from.');
                }
                setAllNames(names);
            } catch (err) {
                setError('Failed to load submissions.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNames();
    }, [token]);

    const startDraw = () => {
        if (allNames.length < 2) {
            setError('You need at least two submissions to draw a winner.');
            return;
        }

        setIsDrawing(true);
        setWinner(null);
        setError('');

        // 1. Fast animation cycling through names
        let animationInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * allNames.length);
            setDisplayedName(allNames[randomIndex]);
        }, 100);

        // 2. After a few seconds, slow down and pick the real winner
        setTimeout(() => {
            clearInterval(animationInterval);
            
            // 3. Call the backend to get the official winner
            generateWinner(token)
                .then(officialWinner => {
                    // 4. Do a final "slow roll" to the winner's name
                    let slowRollIndex = 0;
                    let slowRollInterval = setInterval(() => {
                        setDisplayedName(allNames[slowRollIndex % allNames.length]);
                        if (slowRollIndex > 10 && allNames[slowRollIndex % allNames.length] === officialWinner.name) {
                            clearInterval(slowRollInterval);
                            setWinner(officialWinner);
                            setIsDrawing(false);
                        }
                        slowRollIndex++;
                    }, 300);
                })
                .catch(err => {
                    setError(err.message || 'Failed to draw a winner.');
                    setIsDrawing(false);
                });
        }, 5000); // Run fast animation for 5 seconds
    };

    return (
        <Box>
            {winner && <Confetti />}
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Generate a Winner
            </Typography>
            <Paper sx={{ p: 4, mt: 3, textAlign: 'center', borderRadius: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    And the winner is...
                </Typography>
                <Box sx={{ my: 4, p: 3, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2, minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h2" fontWeight="bold" color="primary">
                        {winner ? winner.name : displayedName}
                    </Typography>
                </Box>
                
                {winner && (
                    <Box mb={3}>
                        <Typography variant="h6">Congratulations!</Typography>
                        <Typography color="text.secondary">Email: {winner.email}</Typography>
                        <Typography color="text.secondary">Mobile: {winner.mobile}</Typography>
                    </Box>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Button
                    variant="contained"
                    size="large"
                    onClick={startDraw}
                    disabled={isDrawing || isLoading || allNames.length === 0}
                    sx={{ minWidth: '200px', py: 1.5 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : (isDrawing ? 'Drawing...' : 'Start the Draw')}
                </Button>
            </Paper>
        </Box>
    );
};

export default WinnerPage;
