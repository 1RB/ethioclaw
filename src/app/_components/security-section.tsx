import { AlertTriangle } from "lucide-react";
import { AnimateOnView } from "~/components/core/animate-on-view";

const RISKS = [
  {
    label: "UNTRUSTED SKILLS",
    description:
      "Community skill registries with thousands of unvetted scripts. Malicious ones were found within weeks.",
    answer: "EthioClaw runs on a managed, audited tool surface instead.",
  },
  {
    label: "EXPOSED CREDENTIALS",
    description:
      "API keys stored in plaintext on your machine. Hundreds of instances found leaking tokens.",
    answer: "EthioClaw never gives the agent a raw key.",
  },
  {
    label: "UNSAFE CODE EXECUTION",
    description:
      "Scripts run locally with your permissions. One prompt injection from an email can trigger destructive commands.",
    answer: "EthioClaw sandboxes all execution remotely.",
  },
] as const;

export function SecuritySection() {
  return (
    <section className="border-b border-border px-4 py-16 md:px-8 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <AnimateOnView className="mb-10 md:mb-16">
          <p className="text-muted-foreground mb-4 text-xs font-bold uppercase tracking-[0.2em]">
            THREAT MODEL
          </p>
          <h2 className="text-foreground text-3xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl">
            SELF-HOSTED AGENTS
            <br />
            <span className="text-primary">ARE DANGEROUS.</span>
          </h2>
        </AnimateOnView>

        <div className="divide-border divide-y">
          {RISKS.map((risk, index) => (
            <AnimateOnView
              key={risk.label}
              className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[240px_1fr] md:gap-8 md:p-8"
              delay={index * 0.1}
              margin="-50px"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  {risk.label}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-foreground text-sm leading-relaxed md:text-base">
                  {risk.description}
                </p>
                <p className="text-primary text-sm leading-relaxed md:text-base">
                  &rarr; {risk.answer}
                </p>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </div>
    </section>
  );
}
