import { Button } from "~/components/ui/button";
import Link from "next/link";
import { AnimateOnView } from "~/components/core/animate-on-view";

type Indicator = "yes" | "no" | "warn";

interface ComparisonRow {
  category: string;
  ethioclaw: Indicator;
  vanilla: Indicator;
}

const ROWS: ComparisonRow[] = [
  { category: "Setup", ethioclaw: "yes", vanilla: "no" },
  { category: "OAuth-only auth", ethioclaw: "yes", vanilla: "no" },
  { category: "Sandboxed execution", ethioclaw: "yes", vanilla: "no" },
  { category: "Managed tool surface", ethioclaw: "yes", vanilla: "warn" },
  { category: "Audit trails", ethioclaw: "yes", vanilla: "no" },
  { category: "One-click revocation", ethioclaw: "yes", vanilla: "warn" },
  { category: "Telegram integration", ethioclaw: "yes", vanilla: "warn" },
];

function Indicator({ type }: { type: Indicator }) {
  if (type === "yes") {
    return <span className="text-primary font-bold">YES</span>;
  }
  if (type === "no") {
    return <span className="text-destructive font-bold">NO</span>;
  }
  return <span className="text-muted-foreground font-bold">PARTIAL</span>;
}

export function ComparisonSection() {
  return (
    <section className="border-b border-border px-4 py-16 md:px-8 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <AnimateOnView className="mb-10 md:mb-16">
          <p className="text-muted-foreground mb-4 text-xs font-bold uppercase tracking-[0.2em]">
            COMPARISON MATRIX
          </p>
          <h2 className="text-foreground text-3xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl">
            VS. SELF-HOSTED
          </h2>
        </AnimateOnView>

        <AnimateOnView delay={0.1} margin="-50px">
          <div className="overflow-x-auto">
            <div className="min-w-[320px] border border-border">
              <div className="grid grid-cols-[1fr_100px_100px] border-b border-border bg-muted/50">
                <div className="p-3 text-xs font-bold uppercase tracking-wider md:p-4"></div>
                <div className="flex items-center justify-center border-l border-border p-3 text-xs font-bold uppercase tracking-wider text-primary md:p-4">
                  ETHIOCLAW
                </div>
                <div className="flex items-center justify-center border-l border-border p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:p-4">
                  DIY
                </div>
              </div>
              {ROWS.map((row) => (
                <div
                  key={row.category}
                  className="grid grid-cols-[1fr_100px_100px] border-b border-border last:border-b-0"
                >
                  <div className="p-3 text-sm font-bold uppercase tracking-tight md:p-4 md:text-base">
                    {row.category}
                  </div>
                  <div className="flex items-center justify-center border-l border-border p-3 md:p-4">
                    <Indicator type={row.ethioclaw} />
                  </div>
                  <div className="flex items-center justify-center border-l border-border p-3 md:p-4">
                    <Indicator type={row.vanilla} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnView>

        <AnimateOnView className="mt-10 flex justify-center md:mt-16" delay={0.2}>
          <Link href="/login">
            <Button
              size="lg"
              className="h-12 w-full rounded-none border border-primary bg-primary px-8 text-base font-bold uppercase tracking-wider text-primary-foreground hover:bg-transparent hover:text-primary md:w-auto"
            >
              ENTER SYSTEM
            </Button>
          </Link>
        </AnimateOnView>
      </div>
    </section>
  );
}
