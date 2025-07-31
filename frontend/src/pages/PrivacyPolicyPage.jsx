import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const PrivacyPolicyPage = ({ navigateTo }) => {
    return (
        <Container component="main" maxWidth="md" sx={{ my: 4 }}>
            <Box
                sx={{
                    width: '100%',
                    p: { xs: 3, sm: 5 },
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                }}
            >
                <Typography component="h1" variant="h4" fontWeight="bold" mb={3}>
                    Privacy Policy
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mb={3}>
                    Last Updated: July 26, 2025
                </Typography>
                <Typography paragraph color="text.secondary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
                </Typography>
                <Typography component="h2" variant="h6" fontWeight="bold" mt={4} mb={1}>
                    Information We Collect
                </Typography>
                <Typography paragraph color="text.secondary">
                    Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.
                </Typography>
                <Typography component="h2" variant="h6" fontWeight="bold" mt={4} mb={1}>
                    How We Use Your Information
                </Typography>
                <Typography paragraph color="text.secondary">
                    Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigateTo('landing')}
                    sx={{ mt: 4 }}
                >
                    Back to Homepage
                </Button>
            </Box>
        </Container>
    );
};

export default PrivacyPolicyPage;
