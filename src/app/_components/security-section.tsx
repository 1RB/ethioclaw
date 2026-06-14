import { AlertTriangle } from "lucide-react";
import { AnimateOnView } from "~/components/core/animate-on-view";

const RISKS = [
  {
    label: "Untrusted Skills",
    description:
      "Community skill registries with thousands of unvetted scripts. Malicious ones were found within weeks.",
    answer: "EthioClaw runs on a managed, audited tool surface instead.",
  },
  {
    label: "Exposed Credentials",
    description:
      "API keys stored in plaintext on your machine. Hundreds of instances found leaking tokens.",
    answer: "EthioClaw never gives the agent a raw key.",
  },
  {
    label: "Unsafe Code Execution",
    description:
      "Scripts run locally with your permissions. One prompt injection from an email can trigger destructive commands.",
    answer: "EthioClaw sandboxes all execution remotely.",
  },
] as const;

export function SecuritySection() {
  return (
    <section className="px-6 py-20 md:px-8 md:py-28 lg:py-36">
      <div className="mx-auto max-w-4xl">
        <AnimateOnView className="mb-12 md:mb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Why not vanilla OpenClaw?
          </p>
          <h2 className="font-serif-display text-3xl font-normal leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            OpenClaw is powerful.
            <br />
            Its default setup is a security liability.
          </h2>
        </AnimateOnView>

        <div className="space-y-8">
          {RISKS.map((risk, index) => (
            <AnimateOnView
              key={risk.label}
              className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-5 md:flex-row md:gap-8 md:p-6"
              delay={index * 0.1}
              margin="-50px"
            >
              <div className="flex shrink-0 items-center gap-3 md:w-56">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {risk.label}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {risk.description}
                </p>
                <p className="text-sm font-medium leading-relaxed text-primary">
                  {risk.answer}
                </p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
