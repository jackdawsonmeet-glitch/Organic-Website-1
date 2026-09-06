import { pageMetadata } from "../lib/seo";

export const metadata = pageMetadata({
  title: "Symptom Checker for Adults",
  description: "Organize your symptoms, duration, and severity with an educational tool to prepare for a conversation with a healthcare professional.",
  path: "/symptom-checker",
});

export default function SymptomCheckerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
