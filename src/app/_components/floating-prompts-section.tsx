import Image from "next/image";
import { AnimateOnView } from "~/components/core/animate-on-view";

interface Prompt {
  text: string;
  icons: string[];
}

const PROMPTS: Prompt[] = [
  {
    text: "Check my Gmail for all customer emails this month, categorize by complaint vs feature request...",
    icons: ["gmail", "notion"],
  },
  {
    text: "Pull all Reddit threads mentioning [competitor] from the last 3 months, analyze sentiment...",
    icons: ["reddit", "googledocs"],
  },
  {
    text: "Summarize all Slack messages in #product-feedback from this week...",
    icons: ["slack", "linear"],
  },
  {
    text: "Scrape G2 and Capterra reviews for our top 5 competitors...",
    icons: ["googlesheets"],
  },
  {
    text: "Pull this sprint's completed tickets from Linear, draft release notes...",
    icons: ["linear", "googlesheets"],
  },
  {
    text: "Analyze our Supabase user_events table, identify drop-off patterns...",
    icons: ["supabase", "notion"],
  },
];

const APP_ICONS = [
  "gmail",
  "slack",
  "github",
  "notion",
  "linear",
  "figma",
  "googledrive",
  "jira",
  "trello",
  "asana",
  "googlesheets",
  "discord",
] as const;

const MONOCHROME_LOGOS = new Set(["github", "notion", "linear"]);

export function FloatingPromptsSection() {
  return (
    <section className="relative overflow-hidden border-t-2 border-border px-6 py-20 sm:px-8 sm:py-28 md:px-10 md:py-36 lg:py-44">
      <div className="mx-auto max-w-6xl">
        <AnimateOnView
          as="h2"
          className="mb-12 text-center font-serif-display text-3xl font-medium leading-[1.02] tracking-tight text-foreground md:mb-20 md:text-4xl lg:text-5xl"
        >
          All your favourite apps.{" "}
          <span className="italic">Zero setup.</span>
        </AnimateOnView>

        {/* App icon strip */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {APP_ICONS.map((slug) => (
            <div key={slug} className="opacity-40 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
              <Image
                src={`/images/logos/${slug}.svg`}
                alt=""
                aria-hidden
                width={28}
                height={28}
                className={MONOCHROME_LOGOS.has(slug) ? "dark:invert" : ""}
                style={{ width: 28, height: 28 }}
              />
            </div>
          ))}
        </div>

        {/* Prompt grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROMPTS.map((prompt, i) => (
            <AnimateOnView
              key={i}
              className="border-2 border-border bg-card p-4"
              delay={i * 0.08}
              duration={0.4}
            >
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                  {prompt.icons.map((slug) => (
                    <Image
                      key={slug}
                      src={`/images/logos/${slug}.svg`}
                      alt=""
                      aria-hidden
                      width={18}
                      height={18}
                      className={MONOCHROME_LOGOS.has(slug) ? "dark:invert" : ""}
                      style={{ width: 18, height: 18 }}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {prompt.text}
                </p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
