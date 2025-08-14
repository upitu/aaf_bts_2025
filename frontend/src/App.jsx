import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Public pages
import VideoLandingPage from "./pages/VideoLandingPage";
import HomePage from "./pages/HomePage";
import SuperheroesPage from "./pages/SuperheroesPage";
import SuperheroDetailPage from "./pages/SuperheroDetailPage";
import RegistrationPage from "./pages/RegistrationPage";
import TermsPage from "./pages/TermsPage";

// Admin
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/admin/LoginPage";
import OtpPage from "./pages/admin/OtpPage";
import DashboardPage from "./pages/admin/DashboardPage";
import SubmissionsPage from "./pages/admin/SubmissionsPage";
import WinnerPage from "./pages/admin/WinnerPage";

// -------- Helpers ----------
const isAuthed = () => !!localStorage.getItem("adminToken");

function ProtectedRoute({ children }) {
    return isAuthed() ? children : <Navigate to="/admin/login" replace />;
}

/** Home + one-time video gate (stored in sessionStorage) */
function VideoGate() {
    const [showVideo, setShowVideo] = useState(
        () => sessionStorage.getItem("introSeen") !== "1"
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (!showVideo) sessionStorage.setItem("introSeen", "1");
    }, [showVideo]);

    if (showVideo) {
        return (
            <VideoLandingPage
                onVideoEnd={() => {
                    setShowVideo(false);
                    // After video ends, render Home (no redirect needed)
                }}
            />
        );
    }
    return <HomePage />;
}

export default function Root() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/superheroes" element={<SuperheroesPage />} />
            <Route path="/superhero/:heroName" element={<SuperheroDetailPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Admin (auth flow) */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/otp" element={<OtpPage />} />

            {/* Admin (protected) */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="submissions" element={<SubmissionsPage />} />
                <Route path="winner" element={<WinnerPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}