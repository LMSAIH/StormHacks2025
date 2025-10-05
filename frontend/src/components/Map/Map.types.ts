// Types and interfaces for Map components

export interface MapProps {
  showBoundaries: boolean;
  onPermitsLoad?: (permits: any[]) => void;
  onPermitSelect?: (permitId: string | null) => void;
  selectedPermitId?: string | null;
  permits?: any[];
}

export interface Permit {
  _id: string;
  geom?: {
    geometry?: {
      coordinates: [number, number];
    };
  };
  address?: string;
  propertyuse?: string[];
  projectvalue?: number;
  issuedate?: string;
  projectdescription?: string;
}

export interface Amenity {
  _id: string;
  geom?: {
    geometry?: {
      coordinates: [number, number];
    };
  };
  name?: string;
  title_of_work?: string;
  school_name?: string;
  park_name?: string;
  type?: string;
}

export interface AmenityMarkerProps {
  amenity: Amenity;
  type: string;
  onSelect: (amenity: Amenity & { type: string }) => void;
}

export interface MapHookState {
  internalPermits: any[];
  internalSelectedPermitId: string | null;
  visibleInfoCardId: string | null;
  selectedAmenity: any;
  showAmenityModal: boolean;
}

export interface MapHookActions {
  setInternalPermits: (permits: any[]) => void;
  setInternalSelectedPermitId: (id: string | null) => void;
  setVisibleInfoCardId: (id: string | null) => void;
  setSelectedAmenity: (amenity: any) => void;
  setShowAmenityModal: (show: boolean) => void;
}