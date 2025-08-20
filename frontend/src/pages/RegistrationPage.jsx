import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    Select,
    MenuItem,
    Button,
    Alert,
    Grid,
} from '@mui/material';
import Header from '../components/Header';
import { createSubmission } from '../services/api';
import { useTranslation } from 'react-i18next';

const assetForLang = (path, lang) =>
    lang === 'ar' && typeof path === 'string'
        ? path.replace(/(\.\w+)$/, '_ar$1')
        : path;

const CustomFormField = ({ bgImage, name, value, onChange, type = 'text', placeholder, lang }) => (
    <Box
        sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            p: { xs: '1rem 2rem', md: '1.5rem 2.5rem' },
            display: 'flex',
            flexDirection: 'column',
            direction: lang === 'ar' ? 'rtl' : 'ltr',
        }}
    >
        {/* native input so it sits above your designed SVG background */}
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'white',
                fontFamily: 'Abdo Master, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                paddingTop: '40px',
                textAlign: lang === 'ar' ? 'right' : 'left',
            }}
            aria-label={placeholder}
        />
    </Box>
);

export default function RegistrationPage() {
    const { i18n, t } = useTranslation();
    const lang = (i18n.language || 'en').startsWith('ar') ? 'ar' : 'en';

    // UI text (no external json for speed)
    const TEXT = {
        titleImg: assetForLang('/assets/registration-title.svg', lang),
        uploadBtn: lang === 'ar' ? 'ارفع فاتورة الشراء' : 'Upload Purchase Receipt',
        submitBtn: lang === 'ar' ? 'إرسال' : 'Submit',
        success: lang === 'ar' ? 'شكراً على مشاركتك!' : 'Thank you for your submission!',
        errorFill: lang === 'ar'
            ? 'يرجى تعبئة جميع الحقول وإرفاق الفاتورة.'
            : 'Please fill in all fields and upload a receipt.',
        selected: lang === 'ar' ? 'تم اختيار:' : 'Selected:',
        emirateLabel: lang === 'ar' ? 'الإمارة' : 'Emirate',
        bg: assetForLang('/assets/bg.svg', lang),

        // Placeholders (optional – they help UX & accessibility)
        phName: lang === 'ar' ? 'الاسم الكامل' : 'Full Name',
        phEmail: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
        phMobile: lang === 'ar' ? 'رقم الهاتف' : 'Mobile Number',
        phEID: lang === 'ar' ? 'رقم الهوية الإماراتية' : 'Emirates ID',
    };

    // Emirate options (display text only)
    const EMIRATES = lang === 'ar'
        ? ['أبوظبي', 'دبي', 'الشارقة', 'عجمان', 'أم القيوين', 'رأس الخيمة', 'الفجيرة']
        : ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        emirates_id: '',
        emirate: '',
    });
    const [receipt, setReceipt] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setReceipt(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError('');
        setSuccess('');

        if (
            !formData.name ||
            !formData.email ||
            !formData.mobile ||
            !formData.emirates_id ||
            !formData.emirate ||
            !receipt
        ) {
            setError(TEXT.errorFill);
            return;
        }

        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        data.append('receipt', receipt);

        try {
            await createSubmission(data);
            setSuccess(TEXT.success);

            setFormData({ name: '', email: '', mobile: '', emirates_id: '', emirate: '' });
            setReceipt(null);
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                err?.message ||
                (lang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
            setError(String(msg));
        } finally {
            setLoading(false);
        }
    };

    const bgName = assetForLang('/assets/blue-field.svg', lang);
    const bgEmail = assetForLang('/assets/red-field-email.svg', lang);
    const bgPhone = assetForLang('/assets/blue-field-phone.svg', lang);
    const bgEID = assetForLang('/assets/red-field-eid.svg', lang);
    const bgEmirate = assetForLang('/assets/blue-field-emirate.svg', lang);
    const uploadBtnBg = assetForLang('/assets/upload-button.svg', lang);
    const submitBtnBg = assetForLang('/assets/submit-button.svg', lang);

    return (
        <Box>
            <Header />

            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: `url(${TEXT.bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: 4,
                }}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <Container maxWidth="lg">
                    <Stack alignItems="center" spacing={2}>
                        <Box
                            component="img"
                            src={TEXT.titleImg}
                            alt="Registration"
                            sx={{ width: { xs: '80%', md: 400 } }}
                        />

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ width: { xs: '100%', md: '80%' } }}
                        >
                            <Grid container spacing={2} alignItems="center" direction={lang === 'ar' ? 'row-reverse' : 'row'}>
                                <Grid item xs={12} md={6}>
                                    {/* Overlapped stack as you had */}
                                    <Stack spacing={-4}>
                                        <CustomFormField
                                            lang={lang}
                                            bgImage={bgName}
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        <CustomFormField
                                            lang={lang}
                                            bgImage={bgEmail}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                        />
                                        <CustomFormField
                                            lang={lang}
                                            bgImage={bgPhone}
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                        />
                                        <CustomFormField
                                            lang={lang}
                                            bgImage={bgEID}
                                            name="emirates_id"
                                            value={formData.emirates_id}
                                            onChange={handleChange}
                                        />
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2} alignItems={lang === 'ar' ? 'flex-end' : 'flex-start'}>
                                        <Button
                                            component="label"
                                            sx={{
                                                backgroundImage: `url(${uploadBtnBg})`,
                                                backgroundSize: '100% 100%',
                                                width: { xs: 320, md: 400 },
                                                height: 150,
                                                color: 'white',
                                                fontFamily: 'Abdo Master',
                                                fontSize: '1.2rem',
                                                textTransform: 'none',
                                                alignSelf: lang === 'ar' ? 'flex-end' : 'flex-start',
                                            }}
                                        >
                                            {TEXT.uploadBtn}
                                            <input type="file" accept="image/*,application/pdf" hidden onChange={handleFileChange} />
                                        </Button>

                                        {receipt && (
                                            <Typography color="white" sx={{ fontFamily: 'Abdo Master' }}>
                                                {TEXT.selected} {receipt.name}
                                            </Typography>
                                        )}

                                        <Box
                                            sx={{
                                                backgroundImage: `url(${bgEmirate})`,
                                                backgroundSize: '100% 100%',
                                                p: '4rem 2rem 1rem 2rem',
                                                width: { xs: '100%', md: '100%' },
                                            }}
                                        >
                                            <Select
                                                name="emirate"
                                                value={formData.emirate}
                                                onChange={handleChange}
                                                displayEmpty
                                                fullWidth
                                                variant="standard"
                                                sx={{
                                                    color: 'white',
                                                    fontFamily: 'Abdo Master',
                                                    fontSize: '1.2rem',
                                                    direction: lang === 'ar' ? 'rtl' : 'ltr',
                                                    '& .MuiSelect-icon': { color: 'white' },
                                                    '&:before, &:after': { border: 'none' },
                                                }}
                                                renderValue={(val) => (val || TEXT.emirateLabel)}
                                            >
                                                {EMIRATES.map((label) => (
                                                    <MenuItem key={label} value={label} sx={{ fontFamily: 'Abdo Master' }}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>

                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                            {/* Submit button with localized background */}
                            <Button
                                type="submit"
                                disabled={loading}
                                sx={{
                                    backgroundImage: `url(${submitBtnBg})`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: 100,
                                    width: 200,
                                    mt: 3,
                                    color: 'black',
                                    fontFamily: 'Abdo Master',
                                    fontSize: '1.3rem',
                                    textAlign: 'center',
                                    '&:hover': { backgroundColor: 'transparent' },
                                    display: 'block',
                                    marginLeft: 'auto',   // always center horizontally
                                    marginRight: 'auto',  // always center horizontally
                                }}
                            >
                                {TEXT.submitBtn}
                            </Button>
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}