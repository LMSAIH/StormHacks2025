import React from 'react';

interface SolutionsProps {
    // Define props here
}

const Solutions: React.FC<SolutionsProps> = () => {
    return (
    <section id="solutions" className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8 scroll-mt-14 lg:scroll-mt-18">
            <div className="max-w-3xl text-center space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Our Solutions</h2>
                <p className="text-base text-muted-foreground sm:text-lg">
                    Whether you're a nonprofit, government agency, or simply looking for your future home. We want to help you analyze your city, one marker at a time.
                    <br />
                    <br />
                    We tackle the unknowns in your developing neighbourhoods, turning complex data into clear, actionable insights.
                </p>
            </div>
        </section>
    );
};

export default Solutions;