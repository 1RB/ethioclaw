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
import { QUARTER_CIRCLE } from "~/lib/landing-assets";

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
      <div className="h-full rounded-xl bg-gradient-to-br from-border via-border/50 to-transparent p-px">
        <div className="flex h-full flex-col gap-4 rounded-xl bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow-[0_0_15px_oklch(0.488_0.243_264.376/0.2)]">
            <feature.icon className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-semibold text-foreground">{feature.title}</h3>
            {feature.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            )}
          </div>
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
      <div className="h-full rounded-xl bg-gradient-to-br from-border via-border/50 to-transparent p-px">
        <div className="flex h-full flex-col gap-4 rounded-xl bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow-[0_0_15px_oklch(0.488_0.243_264.376/0.2)]">
            <Layers className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-semibold text-foreground">
              1000+ Integrations
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connect to all of your favourite apps in a single click.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 pt-1">
            {INTEGRATION_TOOLS.map((tool) => (
              <div
                key={tool.slug}
                className="flex items-center justify-center rounded-lg border border-border bg-background p-1.5"
                title={tool.name}
              >
                <Image
                  src={`/images/logos/${tool.slug}.svg`}
                  alt={tool.name}
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            + 985 more
          </p>
        </div>
      </div>
    </AnimateOnView>
  );
}

function MessagingFeatureCard({ index }: { index: number }) {
  return (
    <AnimateOnView delay={index * 0.1}>
      <div className="h-full rounded-xl bg-gradient-to-br from-border via-border/50 to-transparent p-px">
        <div className="flex h-full flex-col gap-4 rounded-xl bg-card p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shadow-[0_0_15px_oklch(0.488_0.243_264.376/0.2)]">
            <MessageCircle className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-semibold text-foreground">
              Messaging Platforms
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Chat with your agent from anywhere you already work.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {MESSAGING_PLATFORMS.map((platform) => (
              <div
                key={platform.slug}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
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
                  className="h-3.5 w-3.5"
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
      </div>
    </AnimateOnView>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative border-b border-border px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <Image
        src={QUARTER_CIRCLE}
        alt=""
        aria-hidden
        width={800}
        height={800}
        priority={false}
        className="pointer-events-none absolute -right-40 top-0 hidden h-[500px] w-[500px] opacity-[0.04] dark:block md:h-[700px] md:w-[700px]"
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <AnimateOnView className="mb-10 md:mb-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Why EthioClaw?
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
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
