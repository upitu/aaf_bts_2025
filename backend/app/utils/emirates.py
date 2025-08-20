from typing import Dict

# Canonical keys we’ll use in charts
CANONICAL = [
    "Abu Dhabi", "Dubai", "Sharjah", "Ajman",
    "Umm Al Quwain", "Ras Al Khaimah", "Fujairah",
]

ALIASES: Dict[str, str] = {
    # English
    "abu dhabi": "Abu Dhabi",
    "dubai": "Dubai",
    "sharjah": "Sharjah",
    "ajman": "Ajman",
    "umm al quwain": "Umm Al Quwain",
    "umm al-quwain": "Umm Al Quwain",
    "ras al khaimah": "Ras Al Khaimah",
    "fujairah": "Fujairah",
    # Arabic (common spellings)
    "أبوظبي": "Abu Dhabi",
    "دبي": "Dubai",
    "الشارقة": "Sharjah",
    "عجمان": "Ajman",
    "أم القيوين": "Umm Al Quwain",
    "رأس الخيمة": "Ras Al Khaimah",
    "الفجيرة": "Fujairah",
}

# Stable colors per canonical emirate (override in frontend if you like)
EMIRATE_COLORS: Dict[str, str] = {
    "Abu Dhabi":    "#EF4444",
    "Dubai":        "#3B82F6",
    "Sharjah":      "#22C55E",
    "Ajman":        "#F59E0B",
    "Umm Al Quwain":"#8B5CF6",
    "Ras Al Khaimah":"#14B8A6",
    "Fujairah":     "#E11D48",
}

def normalize_emirate(raw: str) -> str:
    if not raw:
        return "Unknown"
    k = raw.strip().lower()
    return ALIASES.get(k, raw.strip())  # fallback to original if not matched