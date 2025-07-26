import React, { useState, useRef } from 'react';

const PrivacyPolicyPage = ({ navigateTo }) => {
    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 my-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <div className="prose max-w-none text-gray-600">
                    <p><strong>Last Updated: July 26, 2025</strong></p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.</p>
                    
                    <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">Information We Collect</h2>
                    <p>Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.</p>
                    
                    <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">How We Use Your Information</h2>
                    <p>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante.</p>
                    
                    <h2 className="text-xl font-bold text-gray-800 mt-6 mb-2">Contact Us</h2>
                    <p>Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit.</p>
                </div>
                <button
                    onClick={() => navigateTo('landing')}
                    className="mt-8 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    Back to Homepage
                </button>
            </div>
        </div>
    );
};