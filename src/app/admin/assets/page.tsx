import Image from "next/image";
import { LANDING_ASSETS } from "~/lib/landing-assets";

export const metadata = {
  title: "Asset Manager — EthioClaw",
};

function AssetCard({
  label,
  src,
}: {
  label: string;
  src: string;
}) {
  const isSvg = src.endsWith(".svg");
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="relative flex h-32 items-center justify-center rounded-lg bg-muted/50">
        <Image
          src={src}
          alt={label}
          width={isSvg ? 120 : 200}
          height={isSvg ? 120 : 200}
          className="max-h-28 max-w-full object-contain"
        />
      </div>
      <p className="mt-2 truncate text-xs font-mono text-muted-foreground">
        {src}
      </p>
    </div>
  );
}

function LogoGrid({ title, slugs }: { title: string; slugs: readonly string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-12">
        {slugs.map((slug) => (
          <div
            key={slug}
            className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2"
            title={slug}
          >
            <Image
              src={`/images/logos/${slug}.svg`}
              alt={slug}
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="text-[10px] text-muted-foreground">{slug}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AssetManagerPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Asset Manager</h1>
      <p className="mb-8 text-muted-foreground">
        Preview all landing-page images in one place. Swap files with{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono">
          pnpm swap
        </code>
        .
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AssetCard label="rays_left (hero bg)" src={LANDING_ASSETS.elements.raysLeft} />
        <AssetCard label="cube (bottom cta)" src={LANDING_ASSETS.elements.cube} />
        <AssetCard label="quarter_circle (features bg)" src={LANDING_ASSETS.elements.quarterCircle} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AssetCard label="testimonial: sarah" src={LANDING_ASSETS.testimonials.sarah} />
        <AssetCard label="testimonial: palash" src={LANDING_ASSETS.testimonials.palash} />
        <AssetCard label="testimonial: soham" src={LANDING_ASSETS.testimonials.soham} />
        <AssetCard label="testimonial: karan" src={LANDING_ASSETS.testimonials.karan} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <LogoGrid title="Hero scattered logos" slugs={LANDING_ASSETS.heroLogos.map((l) => l.slug)} />
        <LogoGrid title="Feature integration logos" slugs={LANDING_ASSETS.featureLogos} />
        <LogoGrid title="Floating prompt logos" slugs={LANDING_ASSETS.floatingPromptLogos} />
      </div>
    </main>
  );
}
