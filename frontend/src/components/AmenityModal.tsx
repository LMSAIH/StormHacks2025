import React from 'react';
import { P, PSmall } from './ui/typography';
import { 
  FaTree, 
  FaPalette, 
  FaBuilding, 
  FaBook, 
  FaTheaterMasks, 
  FaRestroom, 
  FaTrain, 
  FaSchool, 
  FaFireExtinguisher 
} from 'react-icons/fa';

interface AmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  amenity: any;
}

const AmenityModal: React.FC<AmenityModalProps> = ({ isOpen, onClose, amenity }) => {
  if (!isOpen || !amenity) return null;

  const getAmenityName = (amenity: any, type: string): string => {
    if (amenity.name) return amenity.name;
    if (amenity.title_of_work) return amenity.title_of_work; // for public art
    if (amenity.school_name) return amenity.school_name; // for schools
    if (amenity.park_name) return amenity.park_name; // for washrooms
    if (amenity.cultural_space_name) return amenity.cultural_space_name; // for cultural spaces
    if (amenity.station) return amenity.station; // for transit stations
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAmenityIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      parks: FaTree,
      public_art: FaPalette,
      community_centers: FaBuilding,
      libraries: FaBook,
      cultural_spaces: FaTheaterMasks,
      public_washrooms: FaRestroom,
      rapid_transit_stations: FaTrain,
      schools: FaSchool,
      fire_halls: FaFireExtinguisher
    };
    return icons[type] || FaBuilding;
  };

  const getAmenityColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      parks: '#22c55e',
      public_art: '#8b5cf6',
      community_centers: '#f59e0b',
      libraries: '#3b82f6',
      cultural_spaces: '#ec4899',
      public_washrooms: '#6b7280',
      rapid_transit_stations: '#ef4444',
      schools: '#10b981',
      fire_halls: '#dc2626'
    };
    return colors[type] || '#6b7280';
  };

  const formatAmenityInfo = (amenity: any, type: string) => {
    const info: { [key: string]: any } = {};
    
    // Common fields
    info['Name'] = getAmenityName(amenity, type);
    info['Type'] = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Type-specific fields (excluding distance and irrelevant info)
    switch (type) {
      case 'parks':
        if (amenity.hectare) info['Size'] = `${amenity.hectare} hectares`;
        if (amenity.neighbourhoodname) info['Neighbourhood'] = amenity.neighbourhoodname;
        if (amenity.streetnumber && amenity.streetname) {
          info['Address'] = `${amenity.streetnumber} ${amenity.streetname}`;
        }
        break;
      case 'schools':
        if (amenity.address) info['Address'] = amenity.address;
        break;
      case 'public_art':
        if (amenity.type) info['Art Type'] = amenity.type;
        if (amenity.status) info['Status'] = amenity.status;
        if (amenity.siteaddress) info['Location'] = amenity.siteaddress;
        break;
      case 'public_washrooms':
        if (amenity.location) info['Location Details'] = amenity.location;
        if (amenity.geo_local_area) info['Area'] = amenity.geo_local_area;
        break;
      case 'community_centers':
        if (amenity.address) info['Address'] = amenity.address;
        if (amenity.geo_local_area) info['Area'] = amenity.geo_local_area;
        break;
      case 'libraries':
        if (amenity.address) info['Address'] = amenity.address;
        if (amenity.geo_local_area) info['Area'] = amenity.geo_local_area;
        break;
      case 'cultural_spaces':
        if (amenity.primary_use) info['Primary Use'] = amenity.primary_use;
        if (amenity.address) info['Address'] = amenity.address;
        if (amenity.local_area) info['Area'] = amenity.local_area;
        if (amenity.square_feet) info['Size'] = `${amenity.square_feet} sq ft`;
        if (amenity.active_space) info['Status'] = amenity.active_space === 'Yes' ? 'Active' : 'Inactive';
        break;
      case 'rapid_transit_stations':
        if (amenity.geo_local_area) info['Area'] = amenity.geo_local_area;
        break;
      case 'fire_halls':
        if (amenity.address) info['Address'] = amenity.address;
        break;
    }
    
    return info;
  };

  const amenityInfo = formatAmenityInfo(amenity, amenity.type);

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[10000]"
      onClick={onClose}
    >
      <div 
        className="relative rounded-lg border border-border bg-card p-4 shadow-2xl backdrop-blur-sm max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
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
        <div className="mb-3 flex items-start gap-3 pr-8">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: getAmenityColor(amenity.type) }}
          >
            {React.createElement(getAmenityIcon(amenity.type), { 
              size: 20, 
              className: "text-white" 
            })}
          </div>
          <div className="min-w-0 flex-1 my-auto">
            <P className="font-bold text-card-foreground leading-tight">
              {getAmenityName(amenity, amenity.type)}
            </P>
          </div>
        </div>

        {/* Amenity Details */}
        <div className="space-y-3 border-t border-border pt-3">
          {Object.entries(amenityInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <PSmall className="text-muted-foreground">{key}:</PSmall>
              <PSmall className="font-medium text-card-foreground max-w-1/2 text-right">
                {value}
              </PSmall>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmenityModal;