// TermsPage.jsx
import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';

// Swap "/foo.ext" -> "/foo_ar.ext" when lang = ar
const assetForLang = (path, lang) =>
    lang === 'ar' && typeof path === 'string' ? path.replace(/(\.\w+)$/, '_ar$1') : path;

const TEXT = {
    title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },

    universal: {
        en: `
      We are giving away 3 family trips to Universal Studios Japan, with each trip valid for 2 adults and up to 3 children per family. The prize includes:<br />
      - Round-trip economy class flights to Osaka, Japan.<br />
      - Hotel accommodation for 2 nights (including breakfast only).<br />
      - One day park access to Universal Studios Japan for 2 adults and up to 3 children per family.<br />
      - Transfer from Airport to Hotel and from Hotel to Airport (Private Vehicle pick up).<br />
      Please note the following exclusions:<br />
      - Visa processing fees (if applicable) will not be covered.<br />
      - No daily allowances will be provided.<br />
      - Meals other than breakfast are not included and will be at the winners’ expense.<br />
      - Travel insurance, transportation within Japan, and any additional personal expenses are not included and are the responsibility of the winners.<br />
      - Any other expenses not clearly mentioned in the prize inclusion list above are not included, and are the sole responsibility of the winners.<br />
      - Any additional person beyond the stated 2 adults and up to 3 children will be considered extra and must be fully covered by the winners.
    `,
        ar: `
      <b>اربح رحلة عائلية إلى يونيفرسال ستوديوز اليابان (3 رحلات)</b><br />
      نقدم ثلاثة رحلات عائلية إلى يونيفرسال ستوديوز اليابان، كل رحلة صالحة لشخصين بالغين وإلى حد ثلاثة أطفال لكل عائلة<br />
      تشمل الجائزة<br />
      تذاكر سفر ذهاباً وإياباً بالدرجة الاقتصادية إلى أوساكا، اليابان-<br />
      إقامة فندقية لليلتين ضمنها وجبة الفطور فقط-<br />
      تذاكر دخول ليوم واحد إلى يونيفرسال ستوديوز اليابان لشخصين بالغين وحتى ثلاثة أطفال لكل عائلة-
      خدمة النقل من المطار إلى الفندق، ومن الفندق إلى المطار بسيارة خاصة<br />
      <b>يرجى ملاحظة الاستثناءات التالية</b>
      رسوم استخراج تأشيرة السفر غير مشمولة (إن طلبت)-<br />
      لا يتم تقديم مصروف يومي للفائزين-<br />
      الوجبات الأخرى غير وجبة الفطور غير مشمولة ويتحمل مصروفها الفائزين-<br />
      تأمين السفر، والتنقل داخل اليابان، وأي نفقات شخصية إضافية غير مشمولة وتكون مسؤولية الفائزين-<br />
      أي نفقات أخرى غير مذكورة بوضوح في قائمة الجائزة غير مشمولة وتقع مسؤوليتها كاملة على الفائزين-<br />
      أي شخص إضافي يتجاوز الشخصين البالغين أو الثلاثة أطفال يعتبر ضيفًا إضافيًا ويتحمل الفائزون كافة
      تكاليفه من تذاكر السفر، والدخول والإقامة، والوجبات، والنفقات أخرى
    `
    },

    warner: {
        en: `
      We are giving away 10 staycations to Warner Bros Abu Dhabi, each valid for 2 adults and up to 3 children per family. The prize includes:<br />
      - Hotel accommodation for 2 nights (including breakfast only).<br />
      - One-day park access for 2 adults and up to 3 children per family.<br />
      Please note the following exclusions:<br />
      - Visa processing fees (if applicable) will not be covered.<br />
      - No daily allowances will be provided.<br />
      - Meals other than breakfast are not included and will be at the winners’ expense.<br />
      - Travel insurance, transportation within UAE, and any additional personal expenses are not included and are the responsibility of the winners.<br />
      - Any other expenses not clearly mentioned in the prize inclusion list above are not included and are the sole responsibility of the winners.<br />
      - Any additional person beyond the stated 2 adults and up to 3 children will be considered extra and must be fully covered by the winners.
    `,
        ar: `
      <b>اربح إقامة عائلية في وارنر براذرز أبوظبي (10 رحلات)</b><br />
      نقدم عشر رحلات لإقامة في وارنر براذرز أبوظبي، كل رحلة صالحة لشخصين بالغين وإلى حد ثلاثة أطفال لكل عائلة-<br />
      تشمل الجائزة<br />
      إقامة فندقية لمدة ليلتين مع وجبة الفطور فقط-<br />
      تذاكر دخول ليوم واحد لمنتزه وارنر براذرز لشخصين بالغين وإلى حد ثلاثة أطفال لكل عائلة-<br />
      <b>يرجى ملاحظة الاستثناءات التالية</b><br />
      رسوم استخراج تأشيرة السفر غير مشمولة (إن طلبت)-<br />
      لا يتم تقديم مصروف يومي للفائزين-<br />
      الوجبات الأخرى غير وجبة الفطور غير مشمولة وتكون على نفقة الفائزين-<br />
      تأمين السفر، والتنقل داخل الإمارات، وأي نفقات شخصية إضافية غير مشمولة وتكون مسؤولية الفائزين-<br />
      أي نفقات أخرى غير مذكورة بوضوح في قائمة الجائزة غير مشمولة وتقع مسؤوليتها كاملة على الفائزين-<br />
      أي شخص إضافي يتجاوز الشخصين البالغين أو الثلاثة أطفال يعتبر ضيفًا إضافيًا ويتحمل الفائزون كافة تكاليفه
      من تذاكر السفر، والدخول والإقامة، والوجبات، والنفقات أخرى
    `
    },

    general: {
        en: `
      The following conditions apply:<br />
      - The competition is open only to UAE residents with a valid Emirates ID.<br />
      - The last date for submission is 30th September 2025. Winners will be announced on October 15th 2025.<br />
      - The selection of winners will be at the sole discretion of Al Ain Farms management, and all decisions will be final and binding.<br />
      - Prizes are non-transferable and non-redeemable for cash.<br />
      - Participants under the age of 18 must have a parent or legal guardian complete the registration on their behalf.<br />
      - To enter the promotion, participants must purchase any Al Ain Farms products carrying the promotional QR code and register via the landing page after scanning.<br />
      - Receipts must clearly show the date and Al Ain Farms product purchased.<br />
      - Travel vouchers must be used within 6 months of winner announcement, and no later than March 31, 2026.<br />
      - We are purchasing and providing tickets/vouchers as prizes without any affiliation with the ticket/voucher issuers.<br />
      - By registering, each participant accepts and agrees to abide by the campaign’s terms and conditions.
    `,
        ar: `
      تُطبق الشروط التالية على كلا رحلتين اليابان وأبوظبي<br />
      المسابقة مفتوحة فقط للمقيمين في دولة الإمارات العربية المتحدة ممن لديهم بطاقة هوية إماراتية سارية المفعول-<br />
      للمشاركة في العرض، يجب على المتسابقين شراء أي منتج من منتجات مزارع العين من ألبان أو الزبادي  -<br />
       أو العصير أو الدواجن أو الجبن التي تحتوي على رمز الاستجابة السريع الخاص بالعرض <br />
      يجب على المشاركين إدخال على الصفحة الرئيسية، الاسم، والبريد الإلكتروني، ورقم الهاتف، والإمارة، ورقم الهوية الإماراتية-<br />
       وتحميل صورة واضحة لإيصال الشراء يظهر فيه تاريخ الشراء والمنتج من مزارع العين الذي تم شراؤه<br />
      يجب أن يتم التسجيل حصريًا عبر الرابط الإلكتروني الذي يتم الوصول إليه من خلال مسح رمز الاستجابة السريع الموجود على المنتج-<br />
      آخر موعد للإشتراك في المسابقة هو 30 سبتمبر 2025-<br />
      سيتم الإعلان عن أسماء الفائزين في 15 أكتوبر 2025 عبر منصات التواصل الاجتماعي الخاصة بمزارع العين، وسيتم التواصل مع كل -<br />
       فائز بشكل فردي لاستلام الجائزة.<br />
      اختيار الفائزين يتم وفقًا لتقدير إدارة مزارع العين وحدها، وجميع القرارات نهائية وملزمة-<br />
      الجوائز غير قابلة للتحويل أو الاستبدال النقدي-<br />
      يجب استخدام قسائم السفر خلال 6 أشهر من تاريخ إعلان الفائزين، وبحد أقصى 31 مارس 2026-<br />
      يجب على المشاركين الذين تقل أعمارهم عن ثمانية عشر عامًا أن يقوم أحد الوالدين أو الوصي القانوني بإتمام عملية التسجيل نيابةً عنهم-<br />
      نحن نقوم بشراء وتقديم تذاكر يونيفرسال ستوديو اليابان، وورنر براذرز أبوظبي، وقسائم السفر كجوائز، دون أي ارتباط أو تعاون مع -<br />
       الجهة المصدرة للتذاكر أو قسائم السفر.<br />
      من خلال تقديم المعلومات المطلوبة والتسجيل في الحملة، يوافق كل مشارك على الالتزام بشروط وأحكام الحملة-
    `
    }
};

// Reusable colored panel (title optional)
const InfoBox = ({ bgColor, title, children, dir = 'ltr', textAlign = 'left' }) => (
    <Box
        sx={{
            bgcolor: bgColor,
            p: { xs: 2, md: 3 },
            borderRadius: '20px',
            border: '10px solid black',
            color: 'white',
            fontFamily: 'Abdo Master, sans-serif',
            width: { xs: '95%', md: '100%' },
            textAlign,
            direction: dir,
        }}
    >
        {title ? (
            <Typography variant="h6" className="abdo-font" sx={{ fontWeight: 'bold', mb: 1 }} dir={dir}>
                {title}
            </Typography>
        ) : null}
        <Box dir={dir}>{children}</Box>
    </Box>
);

export default function TermsPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language || 'en';
    const isRTL = lang === 'ar';

    const titleBubble = assetForLang('/assets/title-bubble.svg', lang);

    return (
        <Box>
            <Header />
            <Box
                sx={{
                    minHeight: 'calc(100vh - 80px)',
                    backgroundImage: 'url(/assets/bg.svg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: 4,
                }}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <Container maxWidth="lg">
                    <Stack spacing={4} alignItems="center">
                        {/* Page title bubble */}
                        <Box
                            sx={{
                                backgroundImage: `url(${titleBubble})`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                p: { xs: 3, md: 4 },
                                textAlign: 'center',
                                width: { xs: '90%', md: '70%' },
                            }}
                        >
                            <Typography
                                variant="h4"
                                className="abdo-font"
                                sx={{ color: 'black', fontWeight: 'bold' }}
                                dir={isRTL ? 'rtl' : 'ltr'}
                            >
                                {TEXT.title[lang]}
                            </Typography>
                        </Box>

                        {/* Universal section (text contains its own heading in AR/EN) */}
                        <InfoBox
                            bgColor="#d92726"
                            dir={isRTL ? 'rtl' : 'ltr'}
                            textAlign={isRTL ? 'right' : 'left'}
                        >
                            <Typography
                                component="div"
                                sx={{ whiteSpace: 'normal', lineHeight: 1.6, fontFamily: 'Abdo Master, sans-serif' }}
                                dangerouslySetInnerHTML={{ __html: TEXT.universal[lang] }}
                            />
                        </InfoBox>

                        {/* Warner section */}
                        <InfoBox
                            bgColor="#007db5"
                            dir={isRTL ? 'rtl' : 'ltr'}
                            textAlign={isRTL ? 'right' : 'left'}
                        >
                            <Typography
                                component="div"
                                sx={{ whiteSpace: 'normal', lineHeight: 1.6, fontFamily: 'Abdo Master, sans-serif' }}
                                dangerouslySetInnerHTML={{ __html: TEXT.warner[lang] }}
                            />
                        </InfoBox>

                        {/* General conditions (black text on transparent) */}
                        <Box
                            sx={{
                                color: 'black',
                                fontFamily: 'Abdo Master, sans-serif',
                                width: { xs: '95%', md: '80%' },
                                textAlign: isRTL ? 'right' : 'left',
                            }}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <Typography
                                className='abdo-font'
                                component="div"
                                sx={{ whiteSpace: 'normal', lineHeight: 1.7 }}
                                dangerouslySetInnerHTML={{ __html: TEXT.general[lang] }}
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}