import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black opacity-40 text-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center opacity-100">
                    <div className="justify-start">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                    <div className="flex justify-center items-center text-center">
                        <p className="text-sm">
                            Written by Axel Velasquez, Diego Delgado, Elliott Schmechel, and Pawel Michalski for SFU StormHacks 2025
                        </p>
                    </div>
                    <div className="flex gap-4 justify-end pr-4">
                    <a href="#platform" className="text-sm hover:text-gray-300 transition-all">
                        Platform
                    </a>
                    <a href="#solution" className="text-sm hover:text-gray-300 transition-all">
                        Solution
                    </a>
                    <a href="#impact" className="text-sm hover:text-gray-300 transition-all">
                        Impact
                    </a>
                </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;