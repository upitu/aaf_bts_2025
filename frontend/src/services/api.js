/**
 * API helper
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiFetch = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        // Don’t force Content-Type; callers can set it (important for FormData)
        headers: {
            Accept: 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
            const errJson = await res.json();
            detail = errJson?.detail || detail;
        } catch {/* ignore */ }
        throw new Error(detail);
    }

    if (res.status === 204) return null;
    return res.json();
};

// querystring builder
const qs = (obj = {}) =>
    Object.entries(obj)
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');

/* =========================
 * Auth
 * =======================*/
export const requestOtp = (email) =>
    apiFetch('/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

export const verifyOtp = (email, otp) =>
    apiFetch('/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });

/* =========================
 * Dashboard
 * =======================*/
export const getDashboardStats = async (token) => {
    const data = await apiFetch('/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
    });

    // Optional fallback
    if (data?.total_submissions === 0) {
        return {
            total_submissions: 1250,
            submissions_by_emirate: {
                'Abu Dhabi': 350, Dubai: 450, Sharjah: 200, Ajman: 50,
                'Umm Al Quwain': 25, 'Ras Al Khaimah': 125, Fujairah: 50,
            },
            submissions_by_language: { en: 800, ar: 450 },
            submissions_over_time: [],
            peak_hour: null,
        };
    }
    return data;
};

/* =========================
 * Submissions (Admin)
 * =======================*/

/**
 * Server-side pagination/sorting/filtering.
 * Supports both:
 *  - Array response (legacy)
 *  - { items, total } response (preferred)
 */
export const getSubmissions = async (
    token,
    {
        page = 0,
        limit = 10,
        sort_by,
        order,
        q,
        start_date,
        end_date,
    } = {}
) => {
    const query = qs({
        skip: page * limit,
        limit,
        sort_by,
        order,
        q,
        start_date,
        end_date,
    });

    const data = await apiFetch(`/submissions?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (data && typeof data === 'object' && 'items' in data && 'total' in data) {
        return data; // { items, total }
    }

    const items = Array.isArray(data) ? data : [];
    const total = page * limit + items.length;
    return { items, total };
};

/** Delete a single submission by id */
export const deleteSubmission = (token, id) =>
    apiFetch(`/submissions/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

/** Bulk delete submissions by ids array */
export const deleteSubmissions = (token, ids = []) =>
    apiFetch('/submissions/bulk-delete', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
    });

/* =========================
 * Names / Winner
 * =======================*/
export const getSubmissionNames = async (token) => {
    const names = await apiFetch('/submissions/names', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!Array.isArray(names) || names.length === 0) {
        return Array.from({ length: 50 }, (_, i) => `Dummy User ${i + 1}`);
    }
    return names;
};

export const generateWinner = (token) =>
    apiFetch('/dashboard/generate-winner', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });

/* =========================
 * Public submission (FormData)
 * =======================*/
export const createSubmission = (formData) =>
    apiFetch('/submissions/', {
        method: 'POST',
        // Do NOT set Content-Type for FormData — browser sets boundary automatically
        body: formData,
    });