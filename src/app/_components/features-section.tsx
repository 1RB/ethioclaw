import Image from "next/image";
import type { ReactNode } from "react";
import {
  Cloud,
  Clock,
  Shield,
  Zap,
  MessageCircle,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { AnimateOnView } from "~/components/core/animate-on-view";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}

const SMALL_FEATURES: Feature[] = [
  {
    icon: Shield,
    title: "OAuth Only",
    description: (
      <>
        Connects through <strong>OAuth</strong>. No passwords stored or shared.
      </>
    ),
  },
  {
    icon: Zap,
    title: "Zero Setup",
    description: (
      <>
        <strong>Sign up</strong>, chat, done. No API keys or config files.
      </>
    ),
  },
  {
    icon: Clock,
    title: "Works While You Sleep",
    description: (
      <>
        <strong>Schedule</strong> tasks and let your agent handle them on autopilot.
      </>
    ),
  },
  {
    icon: Cloud,
    title: "Sandboxed Execution",
    description: (
      <>
        Every action runs in an <strong>isolated cloud environment</strong> that&apos;s gone when the task is done.
      </>
    ),
  },
];

const MESSAGING_PLATFORMS: {
  name: string;
  slug: string;
  disabled: boolean;
}[] = [
  { name: "Telegram", slug: "telegram", disabled: false },
  { name: "WhatsApp", slug: "whatsapp", disabled: true },
  { name: "Discord", slug: "discord", disabled: true },
  { name: "Slack", slug: "slack", disabled: true },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="h-full border-2 border-border bg-card p-6">
        <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted">
          <feature.icon className="h-5 w-5 text-foreground" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {feature.title}
          </h3>
          {feature.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          )}
        </div>
      </div>
    </AnimateOnView>
  );
}

const INTEGRATION_TOOLS: { slug: string; name: string }[] = [
  { slug: "gmail", name: "Gmail" },
  { slug: "github", name: "GitHub" },
  { slug: "notion", name: "Notion" },
  { slug: "figma", name: "Figma" },
  { slug: "linear", name: "Linear" },
  { slug: "jira", name: "Jira" },
  { slug: "discord", name: "Discord" },
  { slug: "googledrive", name: "Google Drive" },
  { slug: "googlecalendar", name: "Google Calendar" },
  { slug: "todoist", name: "Todoist" },
  { slug: "asana", name: "Asana" },
  { slug: "trello", name: "Trello" },
  { slug: "stripe", name: "Stripe" },
  { slug: "hubspot", name: "HubSpot" },
  { slug: "airtable", name: "Airtable" },
];

function IntegrationsFeatureCard({ index }: { index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="h-full border-2 border-border bg-card p-6">
        <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted">
          <Layers className="h-5 w-5 text-foreground" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            1000+ Integrations
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Connect to all of your favourite apps in a single click.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 pt-1 sm:grid-cols-5">
          {INTEGRATION_TOOLS.map((tool) => (
            <div
              key={tool.slug}
              className="flex items-center justify-center border border-border bg-background p-1.5"
              title={tool.name}
            >
              <Image
                src={`/images/logos/${tool.slug}.svg`}
                alt={tool.name}
                width={20}
                height={20}
                className={`h-5 w-5 ${["github", "notion", "linear"].includes(tool.slug) ? "dark:invert" : ""}`}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          + 985 more
        </p>
      </div>
    </AnimateOnView>
  );
}

function MessagingFeatureCard({ index }: { index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="h-full border-2 border-border bg-card p-6">
        <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted">
          <MessageCircle className="h-5 w-5 text-foreground" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Messaging Platforms
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Chat with your agent from anywhere you already work.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 pt-1">
          {MESSAGING_PLATFORMS.map((platform) => (
            <div
              key={platform.slug}
              className={`inline-flex items-center gap-1.5 border px-3 py-1 text-xs ${
                platform.disabled
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-primary/30 bg-primary/5 text-primary"
              }`}
            >
              <Image
                src={`/images/logos/${platform.slug}.svg`}
                alt={platform.name}
                width={14}
                height={14}
                className={`h-3.5 w-3.5 ${platform.slug === "linear" ? "dark:invert" : ""}`}
              />
              {platform.name}
              {platform.disabled && (
                <span className="text-[10px] text-muted-foreground/60">
                  soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </AnimateOnView>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative border-b-2 border-border px-6 py-20 sm:px-8 sm:py-28 md:px-10 md:py-36 lg:py-44">
      <div className="relative z-10 mx-auto max-w-6xl">
        <AnimateOnView className="mb-12 md:mb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Why EthioClaw?
          </p>
          <h2 className="font-serif-display text-3xl font-medium leading-[1.02] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Secure by default. Powerful by design.
          </h2>
        </AnimateOnView>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SMALL_FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
          <IntegrationsFeatureCard index={4} />
          <MessagingFeatureCard index={5} />
        </div>
      </div>
    </section>
  );
}
