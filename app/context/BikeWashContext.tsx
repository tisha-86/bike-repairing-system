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
  status: "verified" | "pending" | "rejected";
  isSample?: boolean;
}

export interface Biker {
  id: number;
  name: string;
  area: string;
  phone: string;
  rating: number;
  jobs: number;
  status: "Available" | "Busy";
  verificationStatus: "verified" | "pending" | "rejected";
  isSample?: boolean;
}

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface BikeWashContextType {
  servicePoints: ServicePoint[];
  verifiedPoints: ServicePoint[];
  bikers: Biker[];
  verifiedBikers: Biker[];
  notifications: AdminNotification[];
  unreadCount: number;
  addServicePoint: (point: Omit<ServicePoint, "id" | "status">) => void;
  verifyServicePoint: (id: number) => void;
  rejectServicePoint: (id: number) => void;
  addBiker: (biker: { name: string; area: string; phone: string }) => void;
  verifyBiker: (id: number) => void;
  rejectBiker: (id: number) => void;
  toggleBikerStatus: (id: number) => void;
  markAllNotificationsRead: () => void;
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
    lat: 23.8759,
    lng: 90.3795,
    status: "verified",
    isSample: true,
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
    status: "verified",
    isSample: true,
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
    status: "verified",
    isSample: true,
  },
];

const DEFAULT_BIKERS: Biker[] = [
  { id: 1, name: "Rahim", area: "Central", phone: "01800000001", rating: 4.8, jobs: 120, status: "Available", verificationStatus: "verified", isSample: true },
  { id: 2, name: "Karim", area: "North", phone: "01800000002", rating: 4.6, jobs: 95, status: "Available", verificationStatus: "verified", isSample: true },
  { id: 3, name: "Sabbir", area: "Lake View", phone: "01800000003", rating: 4.9, jobs: 140, status: "Busy", verificationStatus: "verified", isSample: true },
  { id: 4, name: "Tanvir", area: "Central", phone: "01800000004", rating: 4.5, jobs: 70, status: "Available", verificationStatus: "verified", isSample: true },
];

const BikeWashContext = createContext<BikeWashContextType | undefined>(undefined);

export function BikeWashProvider({ children }: { children: React.ReactNode }) {
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>(DEFAULT_POINTS);
  const [bikers, setBikers] = useState<Biker[]>(DEFAULT_BIKERS);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const savedPoints = localStorage.getItem("bw_points_v3");
    const savedBikers = localStorage.getItem("bw_bikers_v3");
    const savedNotifs = localStorage.getItem("bw_notifs_v3");
    if (savedPoints) setServicePoints(JSON.parse(savedPoints));
    if (savedBikers) setBikers(JSON.parse(savedBikers));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  const savePoints = (updated: ServicePoint[]) => {
    setServicePoints(updated);
    localStorage.setItem("bw_points_v3", JSON.stringify(updated));
  };

  const saveBikers = (updated: Biker[]) => {
    setBikers(updated);
    localStorage.setItem("bw_bikers_v3", JSON.stringify(updated));
  };

  const saveNotifs = (updated: AdminNotification[]) => {
    setNotifications(updated);
    localStorage.setItem("bw_notifs_v3", JSON.stringify(updated));
  };

  const pushNotification = (title: string, message: string) => {
    const newNotif: AdminNotification = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleString(),
      read: false,
    };
    saveNotifs([newNotif, ...notifications]);
  };

  const addServicePoint = (point: Omit<ServicePoint, "id" | "status">) => {
    const newPoint: ServicePoint = {
      ...point,
      id: Date.now(),
      status: "pending",
      isSample: false,
    };
    savePoints([newPoint, ...servicePoints]);
    pushNotification(
      "New service point",
      `${point.name} registered and is waiting for verification.`
    );
  };

  const verifyServicePoint = (id: number) => {
    savePoints(
      servicePoints.map((pt) => (pt.id === id ? { ...pt, status: "verified" } : pt))
    );
  };

  const rejectServicePoint = (id: number) => {
    savePoints(
      servicePoints.map((pt) => (pt.id === id ? { ...pt, status: "rejected" } : pt))
    );
  };

  const addBiker = (biker: { name: string; area: string; phone: string }) => {
    const newBiker: Biker = {
      id: Date.now(),
      name: biker.name,
      area: biker.area,
      phone: biker.phone,
      rating: 5.0,
      jobs: 0,
      status: "Available",
      verificationStatus: "pending",
      isSample: false,
    };
    saveBikers([newBiker, ...bikers]);
    pushNotification(
      "New biker registration",
      `${biker.name} (${biker.area}) applied and is waiting for verification.`
    );
  };

  const verifyBiker = (id: number) => {
    saveBikers(
      bikers.map((b) => (b.id === id ? { ...b, verificationStatus: "verified" } : b))
    );
  };

  const rejectBiker = (id: number) => {
    saveBikers(
      bikers.map((b) => (b.id === id ? { ...b, verificationStatus: "rejected" } : b))
    );
  };

  const toggleBikerStatus = (id: number) => {
    saveBikers(
      bikers.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "Available" ? "Busy" : "Available" }
          : b
      )
    );
  };

  const markAllNotificationsRead = () => {
    saveNotifs(notifications.map((n) => ({ ...n, read: true })));
  };

  const verifiedPoints = servicePoints.filter((pt) => pt.status === "verified");
  const verifiedBikers = bikers.filter((b) => b.verificationStatus === "verified");
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <BikeWashContext.Provider
      value={{
        servicePoints,
        verifiedPoints,
        bikers,
        verifiedBikers,
        notifications,
        unreadCount,
        addServicePoint,
        verifyServicePoint,
        rejectServicePoint,
        addBiker,
        verifyBiker,
        rejectBiker,
        toggleBikerStatus,
        markAllNotificationsRead,
      }}
    >
      {children}
    </BikeWashContext.Provider>
  );
}

export function useBikeWash() {
  const context = useContext(BikeWashContext);
  if (!context) throw new Error("useBikeWash must be used inside BikeWashProvider");
  return context;
}