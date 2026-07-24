import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prediction",
  description: "Upload a chest CT scan and get an instant AI-assisted classification.",
};

export default function PredictLayout({ children }: { children: React.ReactNode }) {
  return children;
}
