import Image from "next/image";
import { MessageCircle, Repeat2, Heart, BarChart2 } from "lucide-react";
import { AnimateOnView } from "~/components/core/animate-on-view";
import { TESTIMONIAL_AVATARS } from "~/lib/landing-assets";

interface Tweet {
  displayName: string;
  handle: string;
  avatar: string;
  body: string;
  replies: number;
  retweets: number;
  likes: number;
  views: string;
  timestamp: string;
}

const TWEETS: Tweet[] = [
  {
    displayName: "Sarah",
    handle: "@sarahfin",
    avatar: TESTIMONIAL_AVATARS.sarah,
    body: "the fact that some of you are giving OpenClaw your passwords and API keys in a plaintext file in 2026 is actually crazy to me",
    replies: 14,
    retweets: 87,
    likes: 342,
    views: "12.4K",
    timestamp: "3:42 PM \u00b7 Feb 8, 2026",
  },
  {
    displayName: "Palash Kala",
    handle: "@kalapolish",
    avatar: TESTIMONIAL_AVATARS.palash,
    body: "A friend asked me to help him set up OpenClaw over the weekend. 2 hours of Docker, port forwarding, .env files. I said bro just try EthioClaw. He messages me from Telegram 5 minutes later like \"wait that's it?\" Yes. That's it :)",
    replies: 7,
    retweets: 28,
    likes: 189,
    views: "3.2K",
    timestamp: "9:15 AM \u00b7 Feb 10, 2026",
  },
  {
    displayName: "Soham",
    handle: "@GanatraSoham",
    avatar: TESTIMONIAL_AVATARS.soham,
    body: "1800 exposed OpenClaw instances leaking API keys this week and people are still handing it their credentials in plaintext. absolute state of AI security in 2026",
    replies: 34,
    retweets: 93,
    likes: 412,
    views: "11.3K",
    timestamp: "11:30 AM \u00b7 Feb 11, 2026",
  },
  {
    displayName: "Karan Vaidya",
    handle: "@KaranVaidya6",
    avatar: TESTIMONIAL_AVATARS.karan,
    body: "EthioClaw >>> OpenClaw for anyone who doesn't want to mass expose their credentials. OAuth only, sandboxed execution, works straight from Telegram. Genuinely don't know why anyone is still self-hosting an AI agent with root access in 2026",
    replies: 31,
    retweets: 156,
    likes: 847,
    views: "38.2K",
    timestamp: "2:08 PM \u00b7 Feb 12, 2026",
  },
];

function TweetCard({ tweet, index }: { tweet: Tweet; index: number }) {
  return (
    <AnimateOnView
      className="border-2 border-border bg-card p-4"
      delay={index * 0.1}
      margin="-60px"
    >
      {/* Header row */}
      <div className="flex items-center gap-2.5">
        <Image
          src={tweet.avatar}
          alt={tweet.displayName}
          width={40}
          height={40}
          loading="lazy"
          className="h-10 w-10 object-cover"
        />
        <div>
          <div className="text-sm font-bold text-foreground">
            {tweet.displayName}
          </div>
          <div className="text-sm text-muted-foreground">{tweet.handle}</div>
        </div>
      </div>

      {/* Body */}
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        {tweet.body}
      </p>

      {/* Engagement row */}
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground/60">
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          {tweet.replies}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 className="h-3.5 w-3.5" />
          {tweet.retweets}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          {tweet.likes}
        </span>
        <span className="flex items-center gap-1">
          <BarChart2 className="h-3.5 w-3.5" />
          {tweet.views}
        </span>
      </div>

      {/* Timestamp */}
      <div className="mt-2 text-xs text-muted-foreground">
        {tweet.timestamp}
      </div>
    </AnimateOnView>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden border-t-2 border-border px-6 py-20 md:px-8 md:py-28 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-20">
          <h2 className="font-serif-display text-3xl font-medium leading-[1.02] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            No seriously, stop giving OpenClaw your passwords.
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {TWEETS.map((tweet, index) => (
            <TweetCard key={tweet.handle} tweet={tweet} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
