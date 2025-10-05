import React from 'react';
import {P } from './typography'

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-background/80 backdrop-blur-sm border-t border-border text-foreground py-6 mt-1">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col justify-start">
                        <P className="text-sm">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </P>
                        <P className="text-xs text-muted-foreground">
                            <a href="https://www.isocons.app/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                Isometric Icons ©2025
                            </a> is licensed under{' '}
                            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                CC BY 4.0
                            </a>
                        </P>
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center text-center">
                        <P className="text-sm">
                            Written by <a href="https://github.com/LMSAIH/StormHacks2025" className="font-semibold" target="_blank" rel="noopener noreferrer">404 Rizz not Found</a> for SFU StormHacks 2025
                        </P>
                    </div>
                    <div className="justify-end pr-4">
                        <P className="text-sm flex gap-4">
                            <a href="#platform" className="hover:text-gray-300 transition-all">
                                Platform
                            </a>
                            <a href="#solutions" className="hover:text-gray-300 transition-all">
                                Solution
                            </a>
                            <a href="#impact" className="hover:text-gray-300 transition-all">
                                Impact
                            </a>
                        </P>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;