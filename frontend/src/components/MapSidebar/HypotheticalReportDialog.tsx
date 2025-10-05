import React, { useState } from 'react';
import { Button } from '../ui/button';
import { H4 } from '../ui/typography';
import { generateHypotheticalImpactReport } from '../../api/requests';
import type { HypotheticalDevelopmentRequest } from '../../api/requests';


interface HypotheticalReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReportGenerated?: (report: any) => void;
  pinnedLocation?: {lon: number, lat: number} | null;
}

const HypotheticalReportDialog: React.FC<HypotheticalReportDialogProps> = ({
  isOpen,
  onClose,
  onReportGenerated,
  pinnedLocation
}) => {
  const [formData, setFormData] = useState<HypotheticalDevelopmentRequest>({
    longitude: pinnedLocation?.lon || -123.1207,
    latitude: pinnedLocation?.lat || 49.2827,
    project_description: '',
    project_value: undefined,
    address: '',
    property_use: [],
    specific_use_category: [],
    max_distance_km: 0.5
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update coordinates when pinnedLocation changes
  React.useEffect(() => {
    if (pinnedLocation) {
      setFormData(prev => ({
        ...prev,
        longitude: pinnedLocation.lon,
        latitude: pinnedLocation.lat
      }));
    }
  }, [pinnedLocation]);

  const handleInputChange = (field: keyof HypotheticalDevelopmentRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_description.trim()) {
      setError('Project description is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const report = await generateHypotheticalImpactReport(formData);
      onReportGenerated?.(report);
      onClose();
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Error generating hypothetical report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div 
        className="relative rounded-lg border border-border bg-card p-6 shadow-2xl backdrop-blur-sm max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute hover:cursor-pointer right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors z-[10000]"
        >
          <span className="text-xs">✕</span>
        </button>

        {/* Header */}
        <div className="mb-4 flex items-start gap-3 pr-8">
          <div className="min-w-0 flex-1 my-auto">
            <H4 className="text-card-foreground">
              Asses Hypothetical Development Impact
            </H4>
          </div>
        </div>

        {/* Form Content */}
        <div className="border-t border-border pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Longitude {pinnedLocation && <span className="text-xs text-muted-foreground">(from pin)</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    pinnedLocation ? 'bg-muted cursor-not-allowed' : 'bg-background'
                  }`}
                  readOnly={!!pinnedLocation}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Latitude {pinnedLocation && <span className="text-xs text-muted-foreground">(from pin)</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    pinnedLocation ? 'bg-muted cursor-not-allowed' : 'bg-background'
                  }`}
                  readOnly={!!pinnedLocation}
                  required
                />
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project Description *
              </label>
              <textarea
                value={formData.project_description}
                onChange={(e) => handleInputChange('project_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe the development project..."
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="123 Main Street, Vancouver, BC"
              />
            </div>

            {/* Project Value */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project Value ($)
              </label>
              <input
                type="number"
                value={formData.project_value || ''}
                onChange={(e) => handleInputChange('project_value', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="15000000"
              />
            </div>

            {/* Use Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Use Category
              </label>
              <select
                value={formData.specific_use_category?.[0] || ''}
                onChange={(e) => handleInputChange('specific_use_category', e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select use category</option>
                <option value="Multiple Dwelling">Multiple Dwelling</option>
                <option value="Single Detached House">Single Detached House</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Institutional">Institutional</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            {/* Search Distance */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Search Radius (km)
              </label>
              <input
                type="number"
                value={formData.max_distance_km || '0.5'}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HypotheticalReportDialog;