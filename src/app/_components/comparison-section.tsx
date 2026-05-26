import { ArrowRight, CircleCheck, CircleX, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
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

export function ComparisonSection() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <AnimateOnView
          as="h2"
          className="mb-10 text-center text-2xl font-bold tracking-tight text-foreground md:mb-16 md:text-3xl lg:text-4xl"
        >
          Why is EthioClaw better?
        </AnimateOnView>

        <AnimateOnView
          className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
          delay={0.1}
          margin="-50px"
        >
          <table className="w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-4 pr-4 text-left" />
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
                <tr key={row.category} className="border-b border-border">
                  <td className="py-4 pr-4 text-sm font-medium text-foreground md:text-base">
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
        </AnimateOnView>

        <AnimateOnView
          className="mt-10 flex justify-center md:mt-16"
          delay={0.2}
        >
          <Link href="/login">
            <Button
              size="lg"
              className="h-12 w-full px-8 text-base sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
