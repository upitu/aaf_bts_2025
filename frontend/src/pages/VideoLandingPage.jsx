import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const VideoLandingPage = ({ onVideoEnd }) => {
    const { t } = useTranslation();
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const handleSkip = () => {
        onVideoEnd();
    };

    const handleVideoEnd = () => {
        onVideoEnd();
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    // This style object ensures the video is fully contained within the viewport.
    const videoStyles = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // This makes the video fit entirely within the screen, adding black bars if necessary.
        objectFit: 'contain', 
        zIndex: -1, // Places the video behind the content
        backgroundColor: 'black', // Sets the color for the letterbox bars
    };

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'black', // Ensure the main container background is black
        }}>
            <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                // REMOVED the 'loop' attribute
                onEnded={handleVideoEnd}
                style={videoStyles}
            >
                <source src="/videos/landing.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Controls Container */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    gap: 2,
                }}
            >
                {/* Unmute Button */}
                <IconButton
                    onClick={toggleMute}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                    }}
                >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>

                {/* Skip Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSkip}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                    }}
                >
                    {t('skip_video')}
                </Button>
            </Box>
        </Box>
    );
};

export default VideoLandingPage;
