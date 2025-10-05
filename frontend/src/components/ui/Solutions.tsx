import React from 'react';
import Beaming from './Beaming';
import {H2, P} from './typography';
interface SolutionsProps {
    // Define props here
}

const Solutions: React.FC<SolutionsProps> = () => {
    return (
    <section id="solutions" className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden px-4 py-16 scroll-mt-14 lg:scroll-mt-18">
            <div className="relative h-full w-full overflow-hidden flex items-center justify-center">         
                <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left side: Header and paragraphs */}
                    <div className="flex-1 space-y-6">
                        <H2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Our Solutions</H2>
                        <div className="space-y-4">
                            <P className="text-base text-muted-foreground sm:text-lg">
                                Whether you're a nonprofit, government agency, or simply looking for your future home. We want to help you analyze your city, one marker at a time.
                            </P>
                            <P className="text-base text-muted-foreground sm:text-lg">
                                We tackle the unknowns in your developing neighbourhoods, turning open source data into clear, actionable insights.
                            </P>
                        </div>
                    </div>
                    
                    {/* Right side: Beaming animation */}
                    <div className="flex-1 flex items-center justify-center">
                        <Beaming/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Solutions;