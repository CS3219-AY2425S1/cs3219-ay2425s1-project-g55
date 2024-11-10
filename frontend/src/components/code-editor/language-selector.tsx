import { BOILERPLATE_CODES, LANGUAGES } from '@/lib/consts';
import React, { useState } from 'react';
import { Button } from '../ui/button';

interface LanguageSelectorProps {
    language: string;
    onChange: (newLanguage: keyof typeof BOILERPLATE_CODES) => void;
}

const ACTIVE_COLOR = "text-blue-400";

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative inline-block text-left mb-4">
            <div>
                <Button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 bg-transparent text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={toggleDropdown}
                >
                    {language} <span className="ml-2">&#x25BC;</span>
                </Button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                className={`block px-4 py-2 text-sm w-full text-left ${lang === language ? ACTIVE_COLOR : "text-gray-700"} hover:bg-gray-100`}
                                onClick={() => {
                                    onChange(lang as keyof typeof BOILERPLATE_CODES);
                                    setIsOpen(false);
                                }}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;