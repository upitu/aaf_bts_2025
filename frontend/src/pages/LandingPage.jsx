import React, { useState } from 'react';

const LandingPage = ({ navigateTo }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required.';
        if (!formData.lastName) newErrors.lastName = 'Last name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (!formData.country) newErrors.country = 'Country is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted:', formData);
            navigateTo('confirmEmail');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Back to School Giveaway!</h1>
                    <p className="text-gray-600">Enter for a chance to win a new laptop and a $500 gift card.</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'}`}
                                placeholder="Jane"
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'}`}
                                placeholder="Doe"
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'}`}
                            placeholder="jane.doe@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 ${errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'}`}
                        >
                            <option value="">Select your country</option>
                            <option value="USA">United States</option>
                            <option value="CAN">Canada</option>
                            <option value="GBR">United Kingdom</option>
                            <option value="AUS">Australia</option>
                        </select>
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                        Enter Giveaway
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-8">
                    By entering, you agree to our <button onClick={() => navigateTo('privacyPolicy')} className="text-indigo-600 hover:underline">Privacy Policy</button> and Official Rules.
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
