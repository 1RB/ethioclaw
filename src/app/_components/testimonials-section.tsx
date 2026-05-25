import { AnimateOnView } from "~/components/core/animate-on-view";

interface Quote {
  id: string;
  body: string;
  handle: string;
}

const QUOTES: Quote[] = [
  {
    id: "01",
    body: "Finally an AI agent that doesn't ask me to paste API keys into a text file. OAuth-only setup took 30 seconds and I was already scheduling calendar invites.",
    handle: "@sarahfin",
  },
  {
    id: "02",
    body: "Friend asked me to help him build an AI assistant. I said try EthioClaw. He messages me from Telegram 5 minutes later like \"wait that's it?\" Yes. That's it.",
    handle: "@kalapolish",
  },
  {
    id: "03",
    body: "The sandboxed execution is what sold me. I can let the agent read my email and update GitHub issues without worrying about it accidentally running rm -rf on my laptop.",
    handle: "@GanatraSoham",
  },
  {
    id: "04",
    body: "Woke up to find my agent had triaged 23 GitHub issues, replied to 5 emails, and scheduled my meetings \u2014 all while I was asleep. 24/7 automation that actually works.",
    handle: "@KaranVaidya6",
  },
];

function QuoteCard({ quote, index }: { quote: Quote; index: number }) {
  return (
    <AnimateOnView
      className="bg-background p-6 md:p-8"
      delay={index * 0.1}
      margin="-60px"
    >
      <span className="text-primary text-xs font-bold uppercase tracking-wider">
        {quote.id}
      </span>
      <p className="mt-4 text-sm leading-relaxed text-foreground">
        &ldquo;{quote.body}&rdquo;
      </p>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {quote.handle}
      </p>
    </AnimateOnView>
  );
}

export function TestimonialsSection() {
  return (
    <section className="border-b border-border px-4 py-16 md:px-8 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <AnimateOnView className="mb-10 md:mb-16">
          <p className="text-muted-foreground mb-4 text-xs font-bold uppercase tracking-[0.2em]">
            FIELD REPORTS
          </p>
          <h2 className="text-foreground text-3xl font-bold leading-none tracking-tight md:text-5xl lg:text-6xl">
            USER TESTIMONIALS
          </h2>
        </AnimateOnView>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {QUOTES.map((quote, index) => (
            <QuoteCard key={quote.id} quote={quote} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
