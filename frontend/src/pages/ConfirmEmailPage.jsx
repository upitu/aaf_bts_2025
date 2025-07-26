import React, { useState, useRef } from 'react';

const ConfirmEmailPage = ({ navigateTo }) => {
    const [code, setCode] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (!/^[0-9]$/.test(value) && value !== "") return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };
    
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^[0-9]{6}$/.test(pasteData)) {
            const newCode = pasteData.split('');
            setCode(newCode);
            inputsRef.current[5].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const confirmationCode = code.join('');
        if (confirmationCode.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }
        
        console.log('Confirmation Code:', confirmationCode);
        navigateTo('thankYou');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h1>
                <p className="text-gray-600 mb-8">We've sent a 6-digit confirmation code to your email address.</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 md:gap-4 mb-6" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                        Confirm
                    </button>
                </form>
                <p className="text-sm text-gray-500 mt-8">
                    Didn't receive a code? <button className="text-indigo-600 hover:underline">Resend code</button>
                </p>
            </div>
        </div>
    );
};

export default ConfirmEmailPage;
