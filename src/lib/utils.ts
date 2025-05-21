import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Capitalize the first letter of a string
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Utility functions for AI-analyzed moods
export const getMoodColor = (score: number) => {
  if (score >= 8) return "green";
  if (score >= 6) return "emerald";
  if (score >= 4) return "amber";
  if (score >= 2) return "orange";
  return "red";
};

export const getMoodColorClasses = (moodColor: string) => {
  let bgColorClass = "bg-gray-50";
  let textColorClass = "text-gray-700";
  let borderColorClass = "border-gray-200";
  
  if (moodColor === "red") {
    bgColorClass = "bg-red-50";
    textColorClass = "text-red-700";
    borderColorClass = "border-red-200";
  } else if (moodColor === "orange") {
    bgColorClass = "bg-orange-50";
    textColorClass = "text-orange-700";
    borderColorClass = "border-orange-200";
  } else if (moodColor === "amber") {
    bgColorClass = "bg-amber-50";
    textColorClass = "text-amber-700";
    borderColorClass = "border-amber-200";
  } else if (moodColor === "emerald") {
    bgColorClass = "bg-emerald-50";
    textColorClass = "text-emerald-700";
    borderColorClass = "border-emerald-200";
  } else if (moodColor === "green") {
    bgColorClass = "bg-green-50";
    textColorClass = "text-green-700";
    borderColorClass = "border-green-200";
  }
  
  return { bgColorClass, textColorClass, borderColorClass };
};

export const getMoodTrend = (averageScore: number) => {
  if (averageScore >= 8) return "You've been feeling great!";
  if (averageScore >= 6) return "You've been doing well overall.";
  if (averageScore >= 4) return "You've been feeling okay.";
  if (averageScore >= 2) return "Things have been challenging.";
  return "You've been having a tough time.";
};

// Generate a simple emoji based on sentiment score
export const getMoodEmoji = (score: number) => {
  if (score >= 8) return "😊"; // Happy
  if (score >= 6) return "🙂"; // Slightly Happy
  if (score >= 4) return "😐"; // Neutral
  if (score >= 2) return "😔"; // Sad
  return "😢"; // Very Sad
};
