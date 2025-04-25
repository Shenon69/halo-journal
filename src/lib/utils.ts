import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for AI-analyzed moods
export const getMoodColor = (score: number) => {
  if (score >= 8) return "green";
  if (score >= 6) return "emerald";
  if (score >= 4) return "amber";
  if (score >= 2) return "orange";
  return "red";
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
