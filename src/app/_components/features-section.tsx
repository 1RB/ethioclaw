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

const DARK_INVERT_LOGOS = new Set(["github", "linear", "notion"]);

function logoInvertClass(slug: string): string {
  return DARK_INVERT_LOGOS.has(slug) ? "dark:invert" : "";
}

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="bg-card border-border/40 h-full rounded-xl border p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <feature.icon className="text-primary h-4 w-4" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-foreground text-base font-semibold">
            {feature.title}
          </h3>
          {feature.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
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
      <div className="bg-card border-border/40 h-full rounded-xl border p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <Layers className="text-primary h-4 w-4" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-foreground text-base font-semibold">
            1000+ Integrations
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Connect to all of your favourite apps in a single click.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-1">
          {INTEGRATION_TOOLS.map((tool) => (
            <Image
              key={tool.slug}
              src={`/images/logos/${tool.slug}.svg`}
              alt={tool.name}
              width={20}
              height={20}
              className={`h-5 w-5 opacity-60 ${logoInvertClass(tool.slug)}`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mt-3 text-center text-xs">
          + 985 more
        </p>
      </div>
    </AnimateOnView>
  );
}

function MessagingFeatureCard({ index }: { index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="bg-card border-border/40 h-full rounded-xl border p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
        <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
          <MessageCircle className="text-primary h-4 w-4" />
        </div>
        <div className="mt-4 flex flex-col gap-1.5">
          <h3 className="text-foreground text-base font-semibold">
            Messaging Platforms
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Chat with your agent from anywhere you already work.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 pt-1">
          {MESSAGING_PLATFORMS.map((platform) => (
            <div
              key={platform.slug}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                platform.disabled
                  ? "border-border/40 bg-muted text-muted-foreground border"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Image
                src={`/images/logos/${platform.slug}.svg`}
                alt={platform.name}
                width={18}
                height={18}
                className={`h-[18px] w-[18px] ${logoInvertClass(platform.slug)}`}
              />
              {platform.name}
              {platform.disabled && (
                <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider">
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
    <section className="relative px-6 py-20 sm:px-8 sm:py-28 md:px-10 md:py-36 lg:py-44">
      <div className="relative z-10 mx-auto max-w-6xl">
        <AnimateOnView className="mb-12 md:mb-20">
          <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-widest">
            Why EthioClaw?
          </p>
          <h2 className="font-serif-display text-foreground text-3xl font-normal leading-[1.1] tracking-tight md:text-4xl lg:text-[2.75rem]">
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
