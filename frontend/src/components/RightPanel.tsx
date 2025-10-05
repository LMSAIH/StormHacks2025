import React, { useState, useEffect } from 'react';
import { P, PSmall } from './ui/typography';

interface RightPanelProps {
    details: {
        name: string;
        category: string;
        coordinates: [number, number];
    } | null;
}

const RightPanel: React.FC<RightPanelProps> = ({ details }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Show panel whenever new details arrive
    useEffect(() => {
        if (details) {
            setIsVisible(true);
        }
    }, [details]);

    if (!details) return null;

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'hospital':
                return '🏥';
            case 'park':
                return '🌳';
            case 'bus-stop':
                return '🚌';
            default:
                return '📍';
        }
    };

    return (
        <div 
            className={`
                fixed right-0 top-0 z-20 h-full w-[448px] 
                transform bg-background shadow-lg transition-transform 
                duration-300 ease-in-out
                ${isVisible ? 'translate-x-0' : 'translate-x-full'}
            `}
        >
            <div className="flex h-full flex-col overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                    <P className="text-lg font-semibold">Location Details</P>
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="rounded-full p-2 hover:bg-muted"
                    >
                        <span className="text-lg transform transition-transform">
                            {isVisible ? '→' : '←'}
                        </span>
                    </button>
                </div>

                {/* Content with animation */}
                <div className={`
                    flex-1 p-6 space-y-6 
                    transition-opacity duration-200 
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                `}>
                    {/* Location Header */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-2xl">{getCategoryIcon(details.category)}</span>
                        </div>
                        <div>
                            <P className="font-semibold">{details.name}</P>
                            <PSmall className="text-muted-foreground capitalize">
                                {details.category.replace('-', ' ')}
                            </PSmall>
                        </div>
                    </div>

                    {/* Rest of the existing content remains the same */}
                    {/* ...existing code... */}
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4">
                    <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                        Contact Agent
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;