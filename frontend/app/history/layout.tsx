import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
  description: "Review and manage your past CT scan predictions.",
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
