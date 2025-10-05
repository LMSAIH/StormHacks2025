// Hook for managing Map state and actions

import { useState } from 'react';
import type { MapHookState, MapHookActions } from './Map.types';

export const useMapState = (): MapHookState & MapHookActions => {
  const [internalPermits, setInternalPermits] = useState<any[]>([]);
  const [internalSelectedPermitId, setInternalSelectedPermitId] = useState<string | null>(null);
  const [visibleInfoCardId, setVisibleInfoCardId] = useState<string | null>(null);
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [showAmenityModal, setShowAmenityModal] = useState(false);

  return {
    // State
    internalPermits,
    internalSelectedPermitId,
    visibleInfoCardId,
    selectedAmenity,
    showAmenityModal,
    
    // Actions
    setInternalPermits,
    setInternalSelectedPermitId,
    setVisibleInfoCardId,
    setSelectedAmenity,
    setShowAmenityModal,
  };
};