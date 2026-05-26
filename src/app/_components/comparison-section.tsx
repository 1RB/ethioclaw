import { ArrowRight, CircleCheck, CircleX, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";

type Indicator = "check" | "warn" | "x";

interface ComparisonRow {
  category: string;
  ethioclaw: string;
  vanilla: string;
  vanillaIndicator: Indicator;
}

const ROWS: ComparisonRow[] = [
  {
    category: "Setup",
    ethioclaw: "Seconds",
    vanilla: "30-60 min (Node, Tailscale, tunnels)",
    vanillaIndicator: "warn",
  },
  {
    category: "Credentials",
    ethioclaw: "Encrypted, managed by Composio",
    vanilla: "Plaintext in local config",
    vanillaIndicator: "warn",
  },
  {
    category: "Code Execution",
    ethioclaw: "Remote sandbox",
    vanilla: "On your local machine",
    vanillaIndicator: "warn",
  },
  {
    category: "Integrations",
    ethioclaw: "500+ with managed OAuth",
    vanilla: "Manual API key setup per app",
    vanillaIndicator: "warn",
  },
  {
    category: "Skill Security",
    ethioclaw: "Managed tool surface",
    vanilla: "Unvetted public registry",
    vanillaIndicator: "x",
  },
  {
    category: "Audit Trails",
    ethioclaw: "Full action log",
    vanilla: "None",
    vanillaIndicator: "x",
  },
  {
    category: "Revocation",
    ethioclaw: "One click",
    vanilla: "Find and delete config files",
    vanillaIndicator: "warn",
  },
];

function IndicatorIcon({ type }: { type: Indicator }) {
  switch (type) {
    case "check":
      return <CircleCheck className="h-5 w-5 shrink-0 text-primary" />;
    case "warn":
      return <AlertTriangle className="h-5 w-5 shrink-0 text-muted-foreground" />;
    case "x":
      return <CircleX className="h-5 w-5 shrink-0 text-destructive" />;
  }
}

function ComparisonCard({ row, index }: { row: ComparisonRow; index: number }) {
  return (
    <AnimateOnView delay={index * 0.05} margin="-40px">
      <div className="border-2 border-border bg-card p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {row.category}
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                EthioClaw
              </p>
              <p className="text-sm text-foreground">{row.ethioclaw}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IndicatorIcon type={row.vanillaIndicator} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Vanilla OpenClaw
              </p>
              <p className="text-sm text-muted-foreground">{row.vanilla}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnView>
  );
}

export function ComparisonSection() {
  return (
    <section className="px-6 py-20 md:px-8 md:py-28 lg:py-36">
      <div className="mx-auto max-w-4xl">
        <AnimateOnView
          as="h2"
          className="mb-12 text-center font-serif-display text-3xl font-medium leading-[1.02] tracking-tight text-foreground sm:mb-16 md:mb-20 md:text-4xl lg:text-5xl"
        >
          Why is EthioClaw better?
        </AnimateOnView>

        {/* Mobile: card grid */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {ROWS.map((row, index) => (
            <ComparisonCard key={row.category} row={row} index={index} />
          ))}
        </div>

        {/* Desktop: table */}
        <AnimateOnView
          className="hidden sm:block"
          delay={0.1}
          margin="-50px"
        >
          <div className="overflow-x-auto border-2 border-border">
            <table className="w-full min-w-[540px] border-collapse">
              <thead>
                <tr className="border-b-2 border-border bg-muted/30">
                  <th className="py-4 pr-4 pl-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground" />
                  <th className="px-4 py-4 text-center text-sm font-semibold text-foreground md:text-base">
                    EthioClaw
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground md:text-base">
                    Vanilla OpenClaw
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.category} className="border-b border-border last:border-0">
                    <td className="py-4 pr-4 pl-4 text-sm font-medium text-foreground md:text-base">
                      {row.category}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <IndicatorIcon type="check" />
                        <span className="text-xs text-muted-foreground md:text-sm">
                          {row.ethioclaw}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <IndicatorIcon type={row.vanillaIndicator} />
                        <span className="text-xs text-muted-foreground md:text-sm">
                          {row.vanilla}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateOnView>

        <AnimateOnView
          className="mt-12 flex justify-center md:mt-16"
          delay={0.2}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border-2 border-border px-8 py-3 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
