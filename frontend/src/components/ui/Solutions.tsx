import React from 'react';
import Beaming from './Beaming';
import { H2, PAnimated } from './typography';


const Solutions: React.FC = () => {
    return (
        <section id="solutions" className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden px-4 py-8 sm:py-16 scroll-mt-14 lg:scroll-mt-18">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/10 via-accent/10 to-transparent pointer-events-none" />

            <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
                <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left side: Header and paragraphs */}
                    <div className="flex-1 space-y-6">
                        <H2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-center sm:text-left">Our Solutions</H2>
                        <div className="space-y-4">
                            <PAnimated
                                className="text-base text-muted-foreground sm:text-lg text-center sm:text-left"
                                animation="blurIn"
                                delay={0.1}
                                duration={0.1}
                            >
                                Whether you're a nonprofit, government agency, or simply looking for your future home. We want to help you analyze your city, one marker at a time. We tackle the unknowns in your developing neighbourhoods, turning open source data into clear, actionable insights.
                            </PAnimated>
                        </div>
                    </div>

                    {/* Right side: Beaming animation */}
                    <div className="flex-1 flex items-center justify-center scale-75 sm:scale-100">
                        <Beaming />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Solutions;