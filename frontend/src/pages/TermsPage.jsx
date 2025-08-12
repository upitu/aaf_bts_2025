import React from 'react';
import { Box, Container, Typography, Stack, List, ListItem, ListItemIcon } from '@mui/material';
import Header from '../components/Header';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const InfoBox = ({ bgColor, title, children }) => (
    <Box
        sx={{
            bgcolor: bgColor,
            p: { xs: 2, md: 3 },
            borderRadius: '20px',
            border: '10px solid black',
            color: 'white',
            fontFamily: 'Abdo Master, sans-serif',
        }}
    >
        <Typography variant="h6" className="abdo-font" sx={{ fontWeight: 'bold', mb: 1 }}>
            {title}
        </Typography>
        {children}
    </Box>
);

const TermsPage = ({ navigate }) => {
    const prizeDetails = {
        universal: [
            "Round-trip economy class flights to Osaka, Japan.",
            "Hotel accommodation for 2 nights (including breakfast only).",
            "One day park access to Universal Studios Japan for 2 adults and up to 3 children per family.",
            "Transfer from Airport to Hotel and from Hotel to Airport (Private Vehicle pick up).",
        ],
        warnerBros: [
            "Hotel accommodation for 2 nights (including breakfast only).",
            "One-day park access for 2 adults and up to 3 children per family.",
        ]
    };

    const generalConditions = [
        "The competition is open only to UAE residents with a valid Emirates ID.",
        "The last date for submission is 30th September 2025. Winners will be announced on October 15th 2025.",
        "The selection of winners will be at the sole discretion of Al Ain Farms management, and all decisions will be final and binding.",
        "Prizes are non-transferable and non-redeemable for cash.",
        "Participants under the age of 18 must have a parent or legal guardian complete the registration on their behalf.",
    ];

    return (
        <Box>
            <Header navigate={navigate} />
            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: 'url(/assets/bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={4} alignItems="center">
                        <Box
                            sx={{
                                backgroundImage: 'url(/assets/title-bubble.svg)',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                p: 4
                            }}
                        >
                            <Typography variant="h4" className="abdo-font" sx={{ color: 'black', fontWeight: 'bold' }}>
                                Terms & Conditions
                            </Typography>
                        </Box>

                        <InfoBox title="Universal Studios Japan (3 Trips)" bgColor="#d92726">
                            <Typography paragraph>
                                We are giving away 3 family trips to Universal Studios Japan, with each trip valid for 2 adults and up to 3 children per family. 
                                <br />The prize includes:
                                <br />-Round-trip economy class flights to Osaka, Japan. 
                                <br />-Hotel accommodation for 2 nights (including breakfast only).
                                <br />-One day park entrance to Universal Studios Japan for 2 adults and up to 3 children per family.
                                <br />-Transfer from Airport to Hotel and from Hotel to Airport (Private Vehicle pick up).
                                <br />Please note the following exclusions:
                                <br />-Visa processing fees (if applicable) will not be covered.
                                <br />-No daily allowances will be provided.
                                <br />-Meals other than breakfast are not included and will be at the winners’ expense.
                                <br />-Travel insurance, transportation within Japan, and any additional personal expenses, are not included and are the
                                <br />responsibility of the winners.
                                <br />-Any other expenses not clearly mentioned in the prize inclusion list above are not included, and are the sole responsibility of the winners.
                               <br />-Any additional person beyond the stated 2 adults and up to 3 children will be considered extra and must be fully covered by the winners, including flights, park access, accommodation, meals, and any other expenses.
                            </Typography>
                        </InfoBox>

                        <InfoBox title="Warner Bros AUH Staycations (10 Trips)" bgColor="#007db5">
                            <Typography paragraph>
                                We are giving away 10 staycations to Warner Bros Abu Dhabi, with each trip valid for 2 adults and up to 3 children per family.
                                <br />The prize includes:
                                <br />-Hotel accommodation for 2 nights (including breakfast only).
                                <br />-One-day park access for 2 adults and up to 3 children per family.Please note the following exclusions:
                                <br />-Visa processing fees (if applicable) will not be covered.
                                <br />-No daily allowances will be provided.
                                <br />-Meals other than breakfast are not included and will be at the winners’ expense.
                                <br />-Travel insurance, transportation within UAE, and any additional personal expenses are not included and are the
                                responsibility of the winners.
                                <br />-Any other expenses not clearly mentioned in the prize inclusion list above are not included and are the sole
                                responsibility of the winners.
                                <br />-Any additional person beyond the stated 2 adults and up to 3 children will be considered extra, and must be fully covered by the winners, including flights, park access, accommodation, meals, and any other expenses.
                            </Typography>
                        </InfoBox>

                        <Box sx={{ color: 'black', fontFamily: 'Abdo Master, sans-serif', textAlign: 'left', width: { xs: '90%', md: '80%' } }}>
                            <Typography paragraph>
                                The following conditions apply:
                                <br />The competition is open only to UAE residents with a valid Emirates ID. To enter the promotion, participants have to purchase any Al Ain Farms milk, yoghurt, juice, poultry,
                                and cheese products that have the promotional QR code on them.
                                On the landing page, participants have to enter their name, email, mobile number, Emirate, Emirates ID number and upload a clear photo of the purchase receipt which
                                shows the date and Al Ain Farms product purchased. Participants have to register only through the online link 
                                which is validated through scanning of the QR code on the product. The last date for submission is 30th September 2025. Winners will be announced on October 15th 2025
                                on Al Ain Farms social media and individually contacted for prize collection.
                                The selection of winners will be at the sole discretion of Al Ain Farms management, and all decisions will be final and binding. The prizes are non-transferable and non-redeemable
                                for cash. The travel vouchers must be used within 6 months of the winners being announced, 
                                no later than March 31, 2026.
                                Participants under the age of 18 must have a parent or legal guardian complete the registration on their behalf .
                                We are purchasing and providing the Universal Studios Japan, Warner Bros. Abu Dhabi tickets, and travel vouchers as prizes without any affiliation or collaboration
                                with the issuers of the tickets and travel vouchers.
                                By submitting the required information and registering for the Campaign,each participant accepts and agrees to abide by the campaign's terms and conditions.
                            </Typography>
                        </Box>

                    </Stack>
                </Container>
            </Box>
        </Box>
    );
};

export default TermsPage;
