import React, { createContext, useContext, useState, useCallback } from 'react';
import { HuntingTrip, PackingItem, HunterMember, GameType, PackingCategory } from '../types';

interface HuntingTripContextType {
  currentTrip: HuntingTrip | null;
  trips: HuntingTrip[];
  createTrip: (trip: Omit<HuntingTrip, 'id'>) => void;
  updateTrip: (tripId: string, updates: Partial<HuntingTrip>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (tripId: string | null) => void;
  
  // Packing list methods
  addPackingItem: (tripId: string, item: Omit<PackingItem, 'id'>) => void;
  updatePackingItem: (tripId: string, itemId: string, updates: Partial<PackingItem>) => void;
  deletePackingItem: (tripId: string, itemId: string) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  
  // Hunting party methods
  addPartyMember: (tripId: string, member: Omit<HunterMember, 'id'>) => void;
  updatePartyMember: (tripId: string, memberId: string, updates: Partial<HunterMember>) => void;
  deletePartyMember: (tripId: string, memberId: string) => void;
}

const HuntingTripContext = createContext<HuntingTripContextType | undefined>(undefined);

export const useHuntingTrip = () => {
  const context = useContext(HuntingTripContext);
  if (!context) {
    throw new Error('useHuntingTrip must be used within a HuntingTripProvider');
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Default packing list items
const getDefaultPackingItems = (): PackingItem[] => [
  { id: generateId(), name: 'Hunting License', category: PackingCategory.LICENSES, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Safety Vest/Orange Gear', category: PackingCategory.SAFETY, isPacked: false, isRequired: true },
  { id: generateId(), name: 'First Aid Kit', category: PackingCategory.SAFETY, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Hunting Knife', category: PackingCategory.TOOLS, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Headlamp/Flashlight', category: PackingCategory.ELECTRONICS, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Water Bottles', category: PackingCategory.FOOD, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Weather-appropriate Clothing', category: PackingCategory.CLOTHING, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Emergency Whistle', category: PackingCategory.SAFETY, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Map and Compass/GPS', category: PackingCategory.ELECTRONICS, isPacked: false, isRequired: true },
  { id: generateId(), name: 'Snacks/Trail Mix', category: PackingCategory.FOOD, isPacked: false, isRequired: false },
  { id: generateId(), name: 'Binoculars', category: PackingCategory.TOOLS, isPacked: false, isRequired: false },
  { id: generateId(), name: 'Game Calls', category: PackingCategory.TOOLS, isPacked: false, isRequired: false },
];

export const HuntingTripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<HuntingTrip[]>([]);
  const [currentTrip, setCurrentTripState] = useState<HuntingTrip | null>(null);

  const createTrip = useCallback((tripData: Omit<HuntingTrip, 'id'>) => {
    const newTrip: HuntingTrip = {
      ...tripData,
      id: generateId(),
      packingList: getDefaultPackingItems(),
    };
    setTrips(prev => [...prev, newTrip]);
    setCurrentTripState(newTrip);
  }, []);

  const updateTrip = useCallback((tripId: string, updates: Partial<HuntingTrip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentTrip?.id]);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
    if (currentTrip?.id === tripId) {
      setCurrentTripState(null);
    }
  }, [currentTrip?.id]);

  const setCurrentTrip = useCallback((tripId: string | null) => {
    if (tripId === null) {
      setCurrentTripState(null);
    } else {
      const trip = trips.find(t => t.id === tripId);
      setCurrentTripState(trip || null);
    }
  }, [trips]);

  // Packing list methods
  const addPackingItem = useCallback((tripId: string, itemData: Omit<PackingItem, 'id'>) => {
    const newItem: PackingItem = {
      ...itemData,
      id: generateId(),
    };
    
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, packingList: [...trip.packingList, newItem] }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { ...prev, packingList: [...prev.packingList, newItem] }
        : null
      );
    }
  }, [currentTrip?.id]);

  const updatePackingItem = useCallback((tripId: string, itemId: string, updates: Partial<PackingItem>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            packingList: trip.packingList.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { 
            ...prev, 
            packingList: prev.packingList.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : null
      );
    }
  }, [currentTrip?.id]);

  const deletePackingItem = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, packingList: trip.packingList.filter(item => item.id !== itemId) }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { ...prev, packingList: prev.packingList.filter(item => item.id !== itemId) }
        : null
      );
    }
  }, [currentTrip?.id]);

  const togglePackingItem = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            packingList: trip.packingList.map(item => 
              item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
            )
          }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { 
            ...prev, 
            packingList: prev.packingList.map(item => 
              item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
            )
          }
        : null
      );
    }
  }, [currentTrip?.id]);

  // Hunting party methods
  const addPartyMember = useCallback((tripId: string, memberData: Omit<HunterMember, 'id'>) => {
    const newMember: HunterMember = {
      ...memberData,
      id: generateId(),
    };
    
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, huntingParty: [...trip.huntingParty, newMember] }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { ...prev, huntingParty: [...prev.huntingParty, newMember] }
        : null
      );
    }
  }, [currentTrip?.id]);

  const updatePartyMember = useCallback((tripId: string, memberId: string, updates: Partial<HunterMember>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            huntingParty: trip.huntingParty.map(member => 
              member.id === memberId ? { ...member, ...updates } : member
            )
          }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { 
            ...prev, 
            huntingParty: prev.huntingParty.map(member => 
              member.id === memberId ? { ...member, ...updates } : member
            )
          }
        : null
      );
    }
  }, [currentTrip?.id]);

  const deletePartyMember = useCallback((tripId: string, memberId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, huntingParty: trip.huntingParty.filter(member => member.id !== memberId) }
        : trip
    ));
    
    if (currentTrip?.id === tripId) {
      setCurrentTripState(prev => prev 
        ? { ...prev, huntingParty: prev.huntingParty.filter(member => member.id !== memberId) }
        : null
      );
    }
  }, [currentTrip?.id]);

  const value = {
    currentTrip,
    trips,
    createTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip,
    addPackingItem,
    updatePackingItem,
    deletePackingItem,
    togglePackingItem,
    addPartyMember,
    updatePartyMember,
    deletePartyMember,
  };

  return (
    <HuntingTripContext.Provider value={value}>
      {children}
    </HuntingTripContext.Provider>
  );
};
