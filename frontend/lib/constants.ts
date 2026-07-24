export const SITE = {
  name: "Pulmo AI",
  tagline: "AI-assisted lung cancer classification from CT imagery",
  description:
    "An AI-assisted screening tool that classifies chest CT images into Normal, Adenocarcinoma, Squamous Cell Carcinoma, or Large Cell Carcinoma using a trained EfficientNet-B0 model.",
} as const;

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/technology", label: "Technology" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/predict", label: "Prediction" },
  { href: "/history", label: "History" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { href: "/predict", label: "Run a Prediction" },
    { href: "/history", label: "Prediction History" },
    { href: "/technology", label: "Technology" },
    { href: "/how-it-works", label: "How It Works" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [{ href: "/privacy", label: "Privacy Policy" }],
} as const;

export const CLASS_NAMES = [
  "Normal",
  "Adenocarcinoma",
  "Squamous Cell Carcinoma",
  "Large Cell Carcinoma",
] as const;
