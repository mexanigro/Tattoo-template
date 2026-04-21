/// <reference types="vite/client" />
import type { BusinessNiche, NichePreset, SiteConfig } from "../types";
import { esteticaPreset } from "./presets/estetica";
import { abogadoPreset } from "./presets/abogado";
import { tattooPreset } from "./presets/tattoo";

// ─── Active Niche ────────────────────────────────────────────────────────────
// Change this single constant to switch the entire site to a different niche.
// All content — brand, hero, services, staff, gallery, legal texts — updates
// automatically. No component files need to be touched.
const ACTIVE_NICHE: BusinessNiche = "tattoo";

// ─── Preset Registry ─────────────────────────────────────────────────────────
const PRESETS: Record<BusinessNiche, NichePreset> = {
  estetica: esteticaPreset,
  abogado: abogadoPreset,
  tattoo: tattooPreset,
};

// ─── Base Config (niche-agnostic) ─────────────────────────────────────────────
// These settings govern infrastructure, feature flags, and integrations.
// They are intentionally separate from niche presets so a developer can
// enable/disable features without touching the content layer.
type BaseConfig = Pick<
  SiteConfig,
  "features" | "payment" | "notifications" | "adminEmail" | "splash"
>;

const BASE_CONFIG: BaseConfig = {
  features: {
    showHero: true,
    showWhyChooseUs: false,
    showServices: true,
    showTeam: true,
    showGallery: true,
    showTestimonials: true,
    showInquiry: true,
    showLocation: true,
    showBooking: true,
    /** Set to false to keep staff cards static (no individual profile pages). */
    enableStaffPages: true,
  },

  payment: {
    enabled: false,
    // 'none' | 'deposit' | 'full' — default: cardless / free booking flow
    mode: "none",
    depositAmount: 2000, // $20.00 if using deposit mode
    currency: "usd",
    stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
  },

  /**
   * NOTIFICATION CONFIGURATION
   *
   * Add the following to your deployment environment secrets to activate:
   *   BUSINESS_OWNER_EMAIL    → main recipient for all alerts
   *   EMAIL_FROM_ADDRESS       → verified "send-from" address
   *   EMAIL_PROVIDER_API_KEY   → API key (Resend, SendGrid, etc.)
   */
  notifications: {
    enabled: true,
    bookingAlerts: true,
    contactInquiries: true,
  },

  /**
   * Must match the Firebase Google sign-in email exactly (case-insensitive).
   * Override per deployment with VITE_ADMIN_EMAIL in `.env`.
   */
  adminEmail:
    (import.meta.env.VITE_ADMIN_EMAIL ?? "").trim() ||
    "admin@mastertemplate.com",

  splash: {
    enabled: true,
    durationMs: 2800,
  },
};

// ─── Final Config Export ──────────────────────────────────────────────────────
// Spread order: preset first (content), then base (infrastructure).
// Base fields intentionally overwrite any same-named preset fields so that
// infrastructure settings are always authoritative.
export const siteConfig: SiteConfig = {
  ...PRESETS[ACTIVE_NICHE],
  ...BASE_CONFIG,
};
