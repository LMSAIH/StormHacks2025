import React, { useState } from 'react';
import { P, PSmall } from './ui/typography';

interface MarkerProps {
    markerType: 'development' | 'building';
    name: string;
    category: string;
    coordinates: [number, number];
    onClick?: () => void;
    setCurrentDevelopment: any;
    setCurrentDevelopmentCoordinates: any;
}

const CustomMarker: React.FC<MarkerProps> = ({ markerType = 'building', name, category, coordinates, setCurrentDevelopment, setCurrentDevelopmentCoordinates }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'hospital':
                return 'bg-red-500 hover:bg-red-600';
            case 'park':
                return 'bg-green-500 hover:bg-green-600';
            case 'bus-stop':
                return 'bg-blue-500 hover:bg-blue-600';
            default:
                return 'bg-primary hover:bg-primary/90';
        }
    };

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
        <div className="relative flex items-center justify-center">
            {/* Marker Pin */}
            <div
                className={`
          relative z-10 flex h-10 w-10 cursor-pointer items-center justify-center 
          rounded-full shadow-lg transition-all duration-300 
          ${getCategoryColor(category)}
          ${isHovered || isClicked ? 'scale-125 shadow-xl' : 'scale-100'}
        `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => { setIsClicked(!isClicked); setCurrentDevelopmentCoordinates(coordinates); }}
            >
                <span className="text-xl">{getCategoryIcon(category)}</span>
            </div>

            {/* Hover Tooltip */}
            {isHovered && !isClicked && (
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="relative rounded-lg border border-border bg-card px-3 py-2 shadow-xl backdrop-blur-sm">
                        <PSmall className="whitespace-nowrap font-semibold text-card-foreground">
                            {name}
                        </PSmall>
                        {/* Arrow */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2">
                            <div className="border-4 border-transparent border-t-card" />
                        </div>
                    </div>
                </div>
            )}

            {/* Click Info Card */}
            {isClicked && (
                <div className="absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative rounded-lg border border-border bg-card p-4 shadow-2xl backdrop-blur-sm">
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsClicked(false);
                            }}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                        >
                            <span className="text-xs">✕</span>
                        </button>

                        {/* Icon */}
                        <div className="mb-3 flex items-center gap-2">
                            <span className="text-3xl">{getCategoryIcon(category)}</span>
                            <div>
                                <P className="font-bold text-card-foreground">{name}</P>
                                <PSmall className="capitalize text-muted-foreground">
                                    {category.replace('-', ' ')}
                                </PSmall>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 border-t border-border pt-3">
                            <div className="flex justify-between">
                                <PSmall className="text-muted-foreground">Latitude:</PSmall>
                                <PSmall className="font-mono text-card-foreground">
                                    {coordinates[1].toFixed(4)}
                                </PSmall>
                            </div>
                            <div className="flex justify-between">
                                <PSmall className="text-muted-foreground">Longitude:</PSmall>
                                <PSmall className="font-mono text-card-foreground">
                                    {coordinates[0].toFixed(4)}
                                </PSmall>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="mt-3 w-full rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                            View Details
                        </button>

                        {/* Arrow */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2">
                            <div className="border-4 border-transparent border-t-card" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomMarker;
