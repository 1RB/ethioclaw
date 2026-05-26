// Central registry for all landing-page image assets.
// Swap files here without touching component code.

export const LANDING_ASSETS = {
  /** Decorative background elements */
  elements: {
    raysLeft: "/images/elements/rays_left.svg",
    cube: "/images/elements/cube.svg",
    quarterCircle: "/images/elements/quarter_circle.svg",
    // Add more as needed:
    // raysRight: "/images/elements/rays_right.svg",
    // circle: "/images/elements/circle.svg",
  },

  /** Scattered / floating tool logos in the hero */
  heroLogos: [
    { slug: "gmail", top: "5%", left: "55%" },
    { slug: "github", top: "18%", left: "85%" },
    { slug: "jira", top: "65%", left: "58%" },
    { slug: "notion", top: "75%", left: "82%" },
    { slug: "googlecalendar", top: "35%", left: "92%" },
    { slug: "linear", top: "85%", left: "70%" },
    { slug: "figma", top: "10%", left: "72%" },
    { slug: "asana", top: "48%", left: "55%" },
    { slug: "trello", top: "8%", left: "95%" },
    { slug: "googledrive", top: "70%", left: "95%" },
    { slug: "discord", top: "40%", left: "65%" },
    { slug: "dropbox", top: "25%", left: "62%" },
  ] as const,

  /** Tool logos shown in the feature grid */
  featureLogos: [
    "gmail",
    "github",
    "jira",
    "notion",
    "googlecalendar",
    "linear",
    "figma",
    "asana",
    "trello",
    "googledrive",
    "discord",
    "dropbox",
    "hubspot",
    "airtable",
    "telegram",
  ] as const,

  /** Testimonial avatars */
  testimonials: {
    sarah: "/images/testimonials/sarah.jpg",
    palash: "/images/testimonials/palash.jpg",
    soham: "/images/testimonials/soham.jpg",
    karan: "/images/testimonials/karan.jpg",
  },

  /** Floating prompt section background logos */
  floatingPromptLogos: [
    "gmail",
    "github",
    "notion",
    "linear",
    "figma",
    "jira",
    "googlecalendar",
    "slack",
    "asana",
    "discord",
    "googledrive",
    "whatsapp",
    "dropbox",
    "hubspot",
    "airtable",
    "telegram",
    "slack",
    "trello",
    "reddit",
    "stripe",
  ] as const,
} as const;

/** Convenience exports for direct import in components */
export const RAYS_LEFT = LANDING_ASSETS.elements.raysLeft;
export const CUBE = LANDING_ASSETS.elements.cube;
export const QUARTER_CIRCLE = LANDING_ASSETS.elements.quarterCircle;
export const SCATTERED_LOGOS = LANDING_ASSETS.heroLogos;
export const TOOL_LOGOS = LANDING_ASSETS.featureLogos;
export const TESTIMONIAL_AVATARS = LANDING_ASSETS.testimonials;
export const FLOATING_LOGOS = LANDING_ASSETS.floatingPromptLogos;
