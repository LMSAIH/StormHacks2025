import React, { useState, useEffect } from 'react';
import { P, PSmall, H3 } from './ui/typography';
import { getImpactReport } from '@/api/requests';
import { PiCaretLeftBold } from "react-icons/pi";
import type { RightPanelProps, ImpactAnalysisResponse, AnalyzedInfrastructure } from '../types/impact';

const RightPanel: React.FC<RightPanelProps> = ({ selectedPermit, isVisible: propIsVisible, onToggle }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [impactData, setImpactData] = useState<ImpactAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle visibility state
    useEffect(() => {
        if (propIsVisible !== undefined) {
            setIsVisible(propIsVisible);
        } else if (selectedPermit) {
            setIsVisible(true);
        }
    }, [propIsVisible, selectedPermit]);

    // Fetch impact analysis when permit changes
    useEffect(() => {
        const fetchImpactAnalysis = async () => {
            if (!selectedPermit?._id) {
                setImpactData(null);
                return;
            }

            // Check if this is a hypothetical permit with embedded impact report
            if (selectedPermit.hypothetical && selectedPermit.impact_report) {
                // Use the embedded impact report directly
                setImpactData({
                    success: true,
                    permit_id: selectedPermit._id,
                    report: selectedPermit.impact_report
                });
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await getImpactReport(selectedPermit._id);
                setImpactData(response);
            } catch (err) {
                console.error('Error fetching impact analysis:', err);
                setError('Failed to load impact analysis');
                setImpactData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchImpactAnalysis();
    }, [selectedPermit?._id, selectedPermit?.hypothetical, selectedPermit?.impact_report]);

    if (!selectedPermit) return null;

    const toggleVisibility = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        onToggle?.();
    };

    const getImpactScoreColor = (score: number): string => {
        if (score > 0) return 'text-green-600';
        if (score < 0) return 'text-red-600';
        return 'text-foreground';
    };

    const getImpactScoreBg = (): string => {
        return 'bg-muted/30 border-border';
    };

    const getImportanceColor = (importance: number): string => {
        if (importance >= 7) return 'text-primary';
        if (importance >= 4) return 'text-foreground';
        return 'text-muted-foreground';
    };


    return (
        <div 
            className={`
                fixed right-0 top-0 z-20 h-full w-[480px] 
                transform bg-card shadow-2xl transition-transform 
                duration-300 ease-in-out border-l border-border
                ${isVisible ? 'translate-x-0' : 'translate-x-full'}
            `}
        >
            {/* Toggle Button - Seamlessly integrated caret */}
            <PiCaretLeftBold 
                onClick={toggleVisibility}
                className={`absolute top-1/2 -translate-y-1/2 z-50 h-12 w-6 bg-card border border-border border-r-0 transition-all duration-300 ease-in-out hover:bg-muted group ${
                    isVisible ? 'left-0 -translate-x-full rounded-l-md' : 'left-0 -translate-x-full rounded-l-md'
                }`} 
            />

            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                    <div>
                        <P className="text-lg font-semibold text-foreground">Impact Analysis</P>
                        <PSmall className="text-muted-foreground">{selectedPermit.address}</PSmall>
                    </div>
                </div>

                {/* Content */}
                <div className={`
                    flex-1 overflow-y-auto transition-opacity duration-200 scrollbar-hide
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                `}>
                    {loading && (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <PSmall className="ml-3 text-muted-foreground">Loading impact analysis...</PSmall>
                        </div>
                    )}

                    {error && (
                        <div className="p-6">
                            <div className="rounded-lg bg-muted/30 border border-border p-4">
                                <P className="text-foreground font-medium">Unable to load impact analysis</P>
                                <PSmall className="text-muted-foreground mt-1">{error}</PSmall>
                            </div>
                        </div>
                    )}

                    {!loading && !error && !impactData && (
                        <div className="p-6">
                            <div className="rounded-lg bg-muted/30 border border-border p-4">
                                <P className="text-foreground font-medium">No impact analysis available</P>
                                <PSmall className="text-muted-foreground mt-1">
                                    Impact analysis has not been generated for this permit yet.
                                </PSmall>
                            </div>
                        </div>
                    )}

                    {!loading && !error && impactData && (
                        <div className="p-6 space-y-6">
                            {/* Analysis Summary */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <H3 className="font-semibold text-card-foreground">
                                            {impactData.report.AnalysisSummary.title}
                                        </H3>
                                        <P className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                            {impactData.report.AnalysisSummary.description}
                                        </P>
                                    </div>
                                </div>

                                {/* Overall Importance Score */}
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                                    <div>
                                        <P className="font-medium text-foreground">Overall Importance</P>
                                        <PSmall className="text-muted-foreground">Project significance level</PSmall>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-2xl font-bold ${getImportanceColor(impactData.report.AnalysisSummary.overallImportance)}`}>
                                            {impactData.report.AnalysisSummary.overallImportance}/10
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Infrastructure Impact List */}
                            <div className="space-y-4">
                                <H3 className="font-semibold text-foreground">Infrastructure Impact</H3>
                                
                                {impactData.report.AnalyzedInfrastructure.length === 0 ? (
                                    <div className="text-center py-8">
                                        <PSmall className="text-muted-foreground">No infrastructure impacts analyzed</PSmall>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {impactData.report.AnalyzedInfrastructure.map((item: AnalyzedInfrastructure, index: number) => (
                                            <div
                                                key={`${item._id}-${index}`}
                                                className={`p-4 rounded-lg border transition-all hover:shadow-sm ${getImpactScoreBg()}`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <P className="font-medium text-card-foreground">{item.name}</P>
                                                            <PSmall className="text-muted-foreground capitalize">
                                                                {item.type.replace('_', ' ')}
                                                            </PSmall>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`text-lg font-bold ${getImpactScoreColor(item.impactScore)}`}>
                                                            {item.impactScore > 0 ? '+' : ''}{item.impactScore}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="bg-muted/20 rounded p-2 border border-border">
                                                        <PSmall className="font-medium text-foreground">Expected Impact:</PSmall>
                                                        <PSmall className="text-muted-foreground">{item.quantitativeImpact}</PSmall>
                                                    </div>
                                                    
                                                    <div>
                                                        <PSmall className="font-medium text-muted-foreground mb-1">Analysis:</PSmall>
                                                        <PSmall className="text-foreground leading-relaxed">
                                                            {item.justification}
                                                        </PSmall>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {impactData && (
                    <div className="border-t border-border p-4">
                        <PSmall className="text-center text-muted-foreground">
                            Analysis generated for permit {impactData.permit_id}
                        </PSmall>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightPanel;