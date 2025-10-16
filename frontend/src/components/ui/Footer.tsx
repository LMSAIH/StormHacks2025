import React from 'react';
import {P } from './typography'

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-background/80 backdrop-blur-sm border-t border-border text-foreground py-6 mt-1">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col gap-6">
                    {/* Top section - Copyright and License */}
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <P className="text-sm text-center md:text-left">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </P>
                        <P className="text-xs text-muted-foreground text-center md:text-left">
                            <a href="https://www.isocons.app/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                Isometric Icons ©2025
                            </a> is licensed under{' '}
                            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                CC BY 4.0
                            </a>
                        </P>
                    </div>
                    
                    {/* Middle section - Team Credit */}
                    <div className="flex justify-center items-center text-center">
                        <P className="text-sm">
                            Written by <a href="https://github.com/LMSAIH/StormHacks2025" className="font-semibold hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">404 Rizz not Found</a> for SFU StormHacks 2025
                        </P>
                    </div>
                    
                    {/* Bottom section - Navigation Links */}
                    <div className="flex justify-center items-center">
                        <P className="text-sm flex flex-wrap gap-4 justify-center">
                            <a href="#platform" className="hover:text-primary transition-all">
                                Platform
                            </a>
                            <a href="#solutions" className="hover:text-primary transition-all">
                                Solution
                            </a>
                            <a href="#impact" className="hover:text-primary transition-all">
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