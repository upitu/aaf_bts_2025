const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * A helper function to handle fetch requests and responses.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - The options for the fetch request (method, headers, body, etc.).
 * @returns {Promise<any>} - The JSON response from the API.
 */
const apiFetch = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// --- Authentication ---
export const requestOtp = (email) => {
    return apiFetch('/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
};

export const verifyOtp = (email, otp) => {
    return apiFetch('/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
    });
};

// --- Dashboard ---
export const getDashboardStats = async (token) => {
    const data = await apiFetch('/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    // If the API returns no submissions, provide dummy data.
    if (data.total_submissions === 0) {
        return {
            total_submissions: 1250,
            submissions_by_emirate: {
                "Abu Dhabi": 350, "Dubai": 450, "Sharjah": 200, "Ajman": 50,
                "Umm Al Quwain": 25, "Ras Al Khaimah": 125, "Fujairah": 50,
            }
        };
    }
    return data;
};

// --- Submissions ---
export const getSubmissions = async (token, page, limit) => {
    const data = await apiFetch(`/submissions?skip=${page * limit}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    // If the API returns an empty list, provide dummy data.
    if (data.length === 0) {
        return Array.from({ length: limit }, (_, i) => ({
            id: i + (page * limit) + 1,
            name: `Dummy User ${i + 1}`,
            email: `dummy${i + 1}@example.com`,
            mobile: `+971 50 000 00${i.toString().padStart(2, '0')}`,
            emirates_id: `784-0000-0000000-${i % 10}`,
            emirate: ["Dubai", "Abu Dhabi", "Sharjah"][i % 3],
            receipt_url: '#',
            submitted_at: new Date().toISOString(),
        }));
    }
    return data;
};

// --- Winner Generation ---

/**
 * Efficiently fetches a list of all submission names for the animation.
 */
export const getSubmissionNames = async (token) => {
    // Call the new, efficient endpoint
    const names = await apiFetch('/submissions/names', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    
    // If the API returns an empty list, provide dummy data for the animation.
    if (names.length === 0) {
        return Array.from({ length: 50 }, (_, i) => `Dummy User ${i + 1}`);
    }
    return names;
};

/**
 * Calls the backend to securely select and return the official winner.
 */
export const generateWinner = (token) => {
    return apiFetch('/dashboard/generate-winner', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });
};