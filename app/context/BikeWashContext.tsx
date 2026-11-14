"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ServicePoint {
  id: number;
  name: string;
  address: string;
  phone: string;
  bikesPerDay: number;
  slotsPerDay: number;
  offDays: string;
  lat: number;
  lng: number;
}

export interface Biker {
  id: number;
  name: string;
  area: string;
  phone: string;
  rating: number;
  jobs: number;
  status: "Available" | "Busy";
}

interface BikeWashContextType {
  servicePoints: ServicePoint[];
  bikers: Biker[];
  addServicePoint: (point: Omit<ServicePoint, "id">) => void;
  addBiker: (biker: { name: string; area: string; phone: string }) => void;
}

const DEFAULT_POINTS: ServicePoint[] = [
  {
    id: 1,
    name: "Uttara Wash Point",
    address: "Sector 7, Uttara",
    phone: "01700000001",
    bikesPerDay: 25,
    slotsPerDay: 8,
    offDays: "Fri",
    lat: 23.8685,
    lng: 90.3985,
  },
  {
    id: 2,
    name: "Dhanmondi Wash Point",
    address: "Road 5, Dhanmondi",
    phone: "01700000002",
    bikesPerDay: 18,
    slotsPerDay: 6,
    offDays: "Fri, Sat",
    lat: 23.7461,
    lng: 90.3742,
  },
  {
    id: 3,
    name: "Gulshan Wash Point",
    address: "Gulshan 2",
    phone: "01700000003",
    bikesPerDay: 30,
    slotsPerDay: 10,
    offDays: "None",
    lat: 23.7925,
    lng: 90.4078,
  },
];

const DEFAULT_BIKERS: Biker[] = [
  { id: 1, name: "Rahim", area: "Central", phone: "01800000001", rating: 4.8, jobs: 120, status: "Available" },
  { id: 2, name: "Karim", area: "North", phone: "01800000002", rating: 4.6, jobs: 95, status: "Available" },
  { id: 3, name: "Sabbir", area: "Lake View", phone: "01800000003", rating: 4.9, jobs: 140, status: "Busy" },
  { id: 4, name: "Tanvir", area: "Central", phone: "01800000004", rating: 4.5, jobs: 70, status: "Available" },
];

const BikeWashContext = createContext<BikeWashContextType | undefined>(undefined);

export function BikeWashProvider({ children }: { children: React.ReactNode }) {
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>(DEFAULT_POINTS);
  const [bikers, setBikers] = useState<Biker[]>(DEFAULT_BIKERS);

  useEffect(() => {
    const savedPoints = localStorage.getItem("bikewash_points");
    const savedBikers = localStorage.getItem("bikewash_bikers");
    if (savedPoints) setServicePoints(JSON.parse(savedPoints));
    if (savedBikers) setBikers(JSON.parse(savedBikers));
  }, []);

  const addServicePoint = (point: Omit<ServicePoint, "id">) => {
    const updated = [...servicePoints, { ...point, id: Date.now() }];
    setServicePoints(updated);
    localStorage.setItem("bikewash_points", JSON.stringify(updated));
  };

  const addBiker = (biker: { name: string; area: string; phone: string }) => {
    const updated = [
      ...bikers,
      {
        id: Date.now(),
        name: biker.name,
        area: biker.area,
        phone: biker.phone,
        rating: 5.0,
        jobs: 0,
        status: "Available" as const,
      },
    ];
    setBikers(updated);
    localStorage.setItem("bikewash_bikers", JSON.stringify(updated));
  };

  return (
    <BikeWashContext.Provider value={{ servicePoints, bikers, addServicePoint, addBiker }}>
      {children}
    </BikeWashContext.Provider>
  );
}

export function useBikeWash() {
  const context = useContext(BikeWashContext);
  if (!context) throw new Error("useBikeWash must be used inside BikeWashProvider");
  return context;
}