import { Booking } from "../context/BikeWashContext";

export interface FraudAnalysis {
  isFraud: boolean;
  riskLevel: "Low" | "Medium" | "High";
  score: number;
  reasons: string[];
}

export interface MaintenancePrediction {
  dueNow: boolean;
  urgency: "Normal" | "Due Soon" | "Urgent";
  summary: string;
  possibleIssues: string[];
  recommendedService: string;
}

// ১. AI Fraud Request Detector
export function analyzeBookingFraud(
  candidate: {
    customerName: string;
    customerPhone: string;
    bikeModel: string;
    date: string;
    servicePoint: string;
  },
  existingBookings: Booking[]
): FraudAnalysis {
  const reasons: string[] = [];
  let score = 0;

  // Check invalid Bangladesh phone pattern
  const cleanPhone = candidate.customerPhone.replace(/\s|-/g, "");
 if (!/^01[3-9]\d{8}$/.test(cleanPhone) || /^01\d(\d)\1{6,}$/.test(cleanPhone)) {
    score += 45;
    reasons.push("Suspicious or repeated-digit phone number pattern");
  }

  // Check spam/gibberish name
  if (candidate.customerName.trim().length < 3 || /(test|fake|asdf|xyz|aaa|123)/i.test(candidate.customerName)) {
    score += 35;
    reasons.push("Unusual or placeholder customer name detected");
  }

  // Check duplicate booking spam on the same date from same phone
  const sameDayDuplicates = existingBookings.filter(
    (b) => b.customerPhone === candidate.customerPhone && b.date === candidate.date && b.status !== "Cancelled"
  );
  if (sameDayDuplicates.length >= 2) {
    score += 50;
    reasons.push(`Multiple bookings (${sameDayDuplicates.length + 1}) from same number on ${candidate.date}`);
  }

  // Check missing realistic bike model
  if (candidate.bikeModel.trim().length < 3) {
    score += 20;
    reasons.push("Incomplete bike model / registration info");
  }

  const riskLevel = score >= 60 ? "High" : score >= 30 ? "Medium" : "Low";
  return {
    isFraud: score >= 50,
    riskLevel,
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["Verified genuine request pattern"],
  };
}

// ২. AI Bike Service Time & Issue Predictor
export function predictBikeMaintenance(
  bikeModel: string,
  daysSinceLastService: number,
  kmSinceLastService: number
): MaintenancePrediction {
  const possibleIssues: string[] = [];
  let urgency: "Normal" | "Due Soon" | "Urgent" = "Normal";
  let dueNow = false;
  let recommendedService = "Basic Wash";

  if (kmSinceLastService >= 2500 || daysSinceLastService >= 60) {
    urgency = "Urgent";
    dueNow = true;
    recommendedService = "Full Detailing";
    possibleIssues.push("Engine oil viscosity breakdown & overheating risk");
    possibleIssues.push("Chain slackening & sprocket dry friction");
    possibleIssues.push("Brake pad wear & dust accumulation in calipers");
    possibleIssues.push("Clogged air filter reducing fuel efficiency");
  } else if (kmSinceLastService >= 1200 || daysSinceLastService >= 30) {
    urgency = "Due Soon";
    dueNow = true;
    recommendedService = "Foam Wash";
    possibleIssues.push("Chain lubrication dried out (rust & noise risk)");
    possibleIssues.push("Mud/grit buildup around suspension seals");
    possibleIssues.push("Spark plug carbon deposit starting");
  } else {
    possibleIssues.push("No major mechanical fault predicted right now");
    possibleIssues.push("Routine exterior dust wash recommended after rainy rides");
  }

  // Model-specific AI insight
  if (/r15|cbr|gsx|mt-15|gixxer|apache/i.test(bikeModel)) {
    possibleIssues.push("High-RPM sport/commuter engine: inspect coolant & chain tension");
  }

  const summary = dueNow
    ? `Service Alert (${urgency}): ${bikeModel || "Your bike"} has run ${kmSinceLastService} km over ${daysSinceLastService} days. Servicing is due now.`
    : `Good Condition: ${bikeModel || "Your bike"} is within safe limits (${kmSinceLastService} km, ${daysSinceLastService} days).`;

  return {
    dueNow,
    urgency,
    summary,
    possibleIssues,
    recommendedService,
  };
}
