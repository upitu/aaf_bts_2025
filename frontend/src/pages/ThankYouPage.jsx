import React, { useState, useRef } from 'react';

const ThankYouPage = ({ navigateTo }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 text-center">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-green-500 mb-6">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
                <p className="text-gray-600 mb-8">Your entry has been confirmed. We'll announce the winner on August 31st. Good luck!</p>
                <button
                    onClick={() => navigateTo('landing')}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    Back to Homepage
                </button>
            </div>
        </div>
    );
};