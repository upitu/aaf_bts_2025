EMIRATE_MAP = {
    'abu dhabi': 'Abu Dhabi', 'أبوظبي': 'Abu Dhabi',
    'dubai': 'Dubai', 'دبي': 'Dubai',
    'sharjah': 'Sharjah', 'الشارقة': 'Sharjah',
    'ajman': 'Ajman', 'عجمان': 'Ajman',
    'umm al quwain': 'Umm Al Quwain', 'أم القيوين': 'Umm Al Quwain',
    'ras al khaimah': 'Ras Al Khaimah', 'رأس الخيمة': 'Ras Al Khaimah',
    'fujairah': 'Fujairah', 'الفجيرة': 'Fujairah',
}
def normalize_emirate(s: str) -> str:
    key = (s or '').strip().lower()
    return EMIRATE_MAP.get(key, s or 'Unknown')