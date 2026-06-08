import {
  waterRecords, blackBoxRecords, machineRecords, kitchenQcRecords,
  pestQcRecords, rubbishRecords, redTagRecords, type ModuleRecord,
} from "./demo-data";

export type ModuleKind = "cleaning" | "qc" | "disposal" | "redtag";

export type ModuleConfig = {
  slug: string;
  key: string;
  title: string;
  nav: string;
  emoji: string;
  group: string;
  kind: ModuleKind;
  sheetTab: string;
  accent: string;          // hex accent used for trend bars + header glow
  unitLabel?: string;      // table header for unit column
  demo: ModuleRecord[];
};

export const MODULES: ModuleConfig[] = [
  { slug: "water-dispenser", key: "water",   title: "Water Dispenser Deep Clean", nav: "Water Dispenser",  emoji: "💧", group: "DEEP CLEANING", kind: "cleaning", sheetTab: "Cambro Water Dispenser Deep Clean", accent: "#10b981", unitLabel: "DISPENSER ID", demo: waterRecords },
  { slug: "black-box",       key: "blackbox",title: "Black Box Deep Clean",       nav: "Black Box",        emoji: "📦", group: "DEEP CLEANING", kind: "cleaning", sheetTab: "Cambro Black Box Deep Clean",       accent: "#06b6d4", unitLabel: "CAMBRO ID",    demo: blackBoxRecords },
  { slug: "machine-clean",   key: "machine", title: "Machine Deep Clean",         nav: "Machine Clean",    emoji: "⚙️", group: "DEEP CLEANING", kind: "cleaning", sheetTab: "Machine Deep Clean",                accent: "#3b82f6", unitLabel: "MACHINE",      demo: machineRecords },
  { slug: "kitchen-utensils",key: "qckit",   title: "5-Minute QC — Kitchen Utensils", nav: "Kitchen Utensils", emoji: "🔍", group: "QC INSPECTIONS", kind: "qc", sheetTab: "5 Minute QC Kitchen Utensils",     accent: "#a78bfa", demo: kitchenQcRecords },
  { slug: "pest-control",    key: "qcpest",  title: "5-Minute QC — Pest Control", nav: "Pest Control",     emoji: "🛡️", group: "QC INSPECTIONS", kind: "qc",      sheetTab: "5 Minute QC Pest Control",          accent: "#a855f7", demo: pestQcRecords },
  { slug: "rubbish-disposal",key: "rubbish", title: "Rubbish Disposal Timing",    nav: "Rubbish Disposal", emoji: "🗑️", group: "OPERATIONS",    kind: "disposal", sheetTab: "Rubbish Disposal Timing",           accent: "#f59e0b", demo: rubbishRecords },
  { slug: "red-tag-items",   key: "redtag",  title: "Red Tag Item Management",    nav: "Red Tag Items",    emoji: "🔴", group: "OPERATIONS",    kind: "redtag",   sheetTab: "Red Tag Item Management",           accent: "#ef4444", demo: redTagRecords },
];

export const moduleBySlug = (slug: string) => MODULES.find((m) => m.slug === slug);

export const OPERATORS = ["Ahmad Faisal","Siti Rahimah","Ravi Kumar","Lim Wei Chen","Fatimah Bte","James Oduya","Sarah Tan"];
