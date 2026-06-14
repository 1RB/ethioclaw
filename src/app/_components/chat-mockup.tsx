import Image from "next/image";
import { CheckCircle2, Wrench } from "lucide-react";
import { EthioClawBrand } from "./ethioclaw-brand";

function ToolBadge({
  name,
  description,
  duration,
  delay,
}: {
  name: string;
  description: string;
  duration: string;
  delay: number;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary"
      style={{ animation: `fade-in-up 0.3s ease-out ${delay}s both` }}
    >
      <CheckCircle2 className="size-3.5 shrink-0" />
      <span className="font-medium">{name}</span>
      <span className="truncate text-primary/70">{description}</span>
      <span className="tabular-nums text-primary/50">{duration}</span>
      <Wrench className="size-3 shrink-0 text-primary/40" />
    </div>
  );
}

function SearchResult({ delay }: { delay: number }) {
  return (
    <div
      className="rounded-lg border border-border/60 bg-card/80 p-3 text-xs"
      style={{ animation: `fade-in-up 0.3s ease-out ${delay}s both` }}
    >
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Use Case</div>
            <div className="font-medium text-foreground">Fetch and categorize emails</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Gmail</div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary">&#9679;</span>
              <span className="text-primary font-medium">Connected</span>
              <span className="text-muted-foreground">sarah@company.com</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommended Tool</div>
            <div className="flex items-center gap-2">
              <Image src="/images/logos/gmail.svg" alt="Gmail" width={12} height={12} className="shrink-0" />
              <span className="font-medium text-foreground">GMAIL_FETCH_EMAILS</span>
              <span className="flex items-center gap-0.5 text-[10px]">
                <span className="text-primary">&#9632;</span>
                <span className="text-muted-foreground">&#9632;</span>
                <span className="text-muted-foreground">&#9632;</span>
              </span>
              <span className="text-[10px] uppercase text-primary">Easy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EXEC_TOOLS = [
  { slug: "GMAIL_FETCH_EMAILS", icon: "gmail" },
  { slug: "GMAIL_CREATE_DRAFT", icon: "gmail" },
  { slug: "NOTION_CREATE_PAGE", icon: "notion" },
];

function ExecResult({ delay }: { delay: number }) {
  return (
    <div
      className="rounded-lg border border-border/60 bg-card/80 p-3 text-xs"
      style={{ animation: `fade-in-up 0.3s ease-out ${delay}s both` }}
    >
      <div className="space-y-1.5">
        {EXEC_TOOLS.map((tool, i) => (
          <div key={i} className="flex items-center gap-2 border-b border-border/30 py-1 last:border-0">
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {i === EXEC_TOOLS.length - 1 ? "└" : "├"}
            </span>
            <Image
              src={`/images/logos/${tool.icon}.svg`}
              alt={tool.icon}
              width={14}
              height={14}
              className={`shrink-0 ${tool.icon === "notion" ? "dark:invert" : ""}`}
            />
            <span className="min-w-0 truncate font-medium text-foreground">
              {tool.slug}
            </span>
            <span className="ml-auto shrink-0 text-primary">Done</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatMockup() {
  return (
    <div
      className="w-full max-w-full px-3 sm:max-w-md sm:px-0 lg:max-w-lg"
      style={{ animation: "fade-in-right 0.7s ease-out 0.5s both" }}
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="border-b border-border/60 px-4 py-3">
          <EthioClawBrand size="sm" />
        </div>

        <div className="flex flex-col gap-2.5 p-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-muted px-3.5 py-2.5">
              <p className="text-sm text-foreground">
                plz handle my customer complaints and log in notion
              </p>
            </div>
          </div>

          {/* SEARCH_TOOLS */}
          <ToolBadge
            name="SEARCH_TOOLS"
            description="Finding the right tool"
            duration="1s"
            delay={0.9}
          />

          <SearchResult delay={1.3} />

          {/* MULTI_EXECUTE_TOOL */}
          <ToolBadge
            name="EXECUTE"
            description="Executing 3 tools"
            duration="2s"
            delay={1.7}
          />

          <ExecResult delay={2.1} />

          {/* Final summary */}
          <div
            className="max-w-[85%]"
            style={{ animation: "fade-in 0.4s ease-out 2.5s both" }}
          >
            <p className="text-sm text-foreground">
              Drafted 3 replies and logged each complaint in your Notion
              tracker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
