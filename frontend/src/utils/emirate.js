const EMIRATE_MAP = new Map([
    // Abu Dhabi
    ['abu dhabi', 'Abu Dhabi'],
    ['أبوظبي', 'Abu Dhabi'],
    ['ابوظبي', 'Abu Dhabi'],

    // Dubai
    ['dubai', 'Dubai'],
    ['دبي', 'Dubai'],

    // Sharjah
    ['sharjah', 'Sharjah'],
    ['الشارقة', 'Sharjah'],

    // Ajman
    ['ajman', 'Ajman'],
    ['عجمان', 'Ajman'],

    // Umm Al Quwain
    ['umm al quwain', 'Umm Al Quwain'],
    ['umm al-qaiwain', 'Umm Al Quwain'],
    ['umm al quwain', 'Umm Al Quwain'],
    ['أم القيوين', 'Umm Al Quwain'],

    // Ras Al Khaimah
    ['ras al khaimah', 'Ras Al Khaimah'],
    ['ras alkhaimah', 'Ras Al Khaimah'],
    ['رأس الخيمة', 'Ras Al Khaimah'],

    // Fujairah
    ['fujairah', 'Fujairah'],
    ['الفجيرة', 'Fujairah'],
]);

export function normalizeEmirate(v) {
    if (!v) return 'Unknown';
    const key = String(v).trim().toLowerCase().replace(/\s+/g, ' ');
    return EMIRATE_MAP.get(key) || v; // fall back to original if unseen
}