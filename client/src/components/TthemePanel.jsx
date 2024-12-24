import React, { useState } from 'react';

const ThemePanel = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.className = newTheme;
    };

    return (

        <button
            onClick={toggleTheme}
            className="bg-primary text-white p-2 rounded">
            Mode
        </button>

    );
};

export default ThemePanel;
