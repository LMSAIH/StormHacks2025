import React, { useState } from 'react';
import { P, PSmall } from './ui/typography';
import {
    FaHammer
} from 'react-icons/fa';

interface PermitMarkerProps {
    permit: {
        _id: string;
        projectvalue?: number;
        address: string;
        projectdescription: string;
        propertyuse: string[];
        specificusecategory: string[];
        geolocalarea: string;
        geom: {
            geometry: {
                coordinates: [number, number];
            };
        };
        permitnumbercreateddate: string;
        issuedate: string;
        permitelapseddays: number;
        distance_km?: number;
    };
    setCurrentDevelopment: (permit: any) => void;
    setCurrentDevelopmentCoordinates: (coords: [number, number]) => void;
    isSelected: boolean;
    onSelect: (permitId: string) => void;
}

const CustomMarker: React.FC<PermitMarkerProps> = ({
    permit,
    setCurrentDevelopment,
    setCurrentDevelopmentCoordinates,
    isSelected,
    onSelect
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const coordinates = permit.geom.geometry.coordinates;
    const primaryUse = permit.propertyuse[0] || 'Unknown';
    const category = permit.specificusecategory[0] || primaryUse;


    const getMarkerSize = (projectValue?: number) => {
        if (!projectValue) return { size: 'h-8 w-8', iconSize: 'text-sm' }; // Default small

        if (projectValue < 2000000) {
            // Small projects (< $2M)
            return { size: 'h-8 w-8', iconSize: 'text-sm' };
        } else if (projectValue < 10000000) {
            // Medium projects ($2M - $10M)
            return { size: 'h-12 w-12', iconSize: 'text-lg' };
        } else {
            // Large projects (> $10M)
            return { size: 'h-16 w-16', iconSize: 'text-2xl' };
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateDescription = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const markerSize = getMarkerSize(permit.projectvalue);
    const IconComponent = FaHammer;

    return (
        <div className="relative flex items-center justify-center">
            {/* Marker Pin */}
            <div
                className={`
          relative ${isSelected ? 'z-[9998]' : 'z-10'} flex ${markerSize.size} cursor-pointer items-center justify-center 
          rounded-full shadow-lg transition-all duration-300 bg-white
          ${isHovered || isSelected ? 'scale-125 shadow-xl' : 'scale-100'}
        `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {
                    onSelect(permit._id);
                    setCurrentDevelopmentCoordinates(coordinates as [number, number]);
                }}
            >
                <IconComponent className={`${markerSize.iconSize} text-black`} />
            </div>

            {/* Hover Tooltip */}
            {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-[9999]">
                    <div className="relative rounded-lg border border-border bg-card px-3 py-2 shadow-xl backdrop-blur-sm">
                        <PSmall className="whitespace-nowrap font-semibold text-card-foreground">
                            {permit.address}
                        </PSmall>
                        <PSmall className="text-xs text-muted-foreground">
                            {category}
                        </PSmall>
                        {/* Arrow */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2">
                            <div className="border-4 border-transparent border-t-card" />
                        </div>
                    </div>
                </div>
            )}

            {/* Click Info Card */}
            {isSelected && (
                <div className="absolute bottom-full left-1/2 mb-2 w-96 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-300 z-[9999]">
                    <div className="relative rounded-lg border border-border bg-card p-4 shadow-2xl backdrop-blur-sm h-fit overflow-y-hidden
                    ">
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(permit._id);
                            }}
                            className="absolute hover:cursor-pointer right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors z-[10000]"
                        >
                            <span className="text-xs">✕</span>
                        </button>

                        {/* Header */}
                        <div className="mb-3 flex items-start gap-2 pr-8">
                            <div className="min-w-0 flex-1">
                                <P className="font-bold text-card-foreground leading-tight">{permit.address}</P>
                            </div>
                        </div>

                        {/* Key Details */}

                        {/* Project Description */}
                        <div className="border-t border-border py-2">
                            <PSmall className="text-muted-foreground mb-2">Project Description:</PSmall>
                            <PSmall className="text-card-foreground leading-relaxed">
                                {truncateDescription(permit.projectdescription)}
                            </PSmall>
                        </div>

                        <div className="space-y-3 border-t border-border pt-3">
                            {permit.projectvalue && (
                                <div className="flex justify-between">
                                    <PSmall className="text-muted-foreground">Project Value:</PSmall>
                                    <PSmall className="font-semibold text-green-600">
                                        {formatCurrency(permit.projectvalue)}
                                    </PSmall>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <PSmall className="text-muted-foreground">Category:</PSmall>
                                <PSmall className="font-medium text-card-foreground max-w-1/2">
                                    {category}
                                </PSmall>
                            </div>

                            <div className="flex justify-between">
                                <PSmall className="text-muted-foreground">Issue Date:</PSmall>
                                <PSmall className="font-medium text-card-foreground">
                                    {formatDate(permit.issuedate)}
                                </PSmall>
                            </div>


                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => setCurrentDevelopment(permit)}
                            className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            View Full Details
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
