import {
  type LucideIcon,
  PackageCheckIcon,
  ShieldCheckIcon,
  BadgeEuroIcon,
  MessagesSquareIcon,
} from "lucide-react";

type ItemsProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const items: ItemsProps[] = [
  {
    icon: PackageCheckIcon,
    title: "Ready to deliver",
    desc: "Carefully handled orders prepared for shipping",
  },
  {
    icon: ShieldCheckIcon,
    title: "Protected checkout",
    desc: "Secure payment with clear order confirmation",
  },
  {
    icon: BadgeEuroIcon,
    title: "Clear pricing",
    desc: "All prices shown in EUR before checkout",
  },
  {
    icon: MessagesSquareIcon,
    title: "Order support",
    desc: "Chat or video assistance linked to your order",
  },
];

const TrustStrip = () => {
  return (
    <section className="group overflow-hidden rounded-box border border-base-300 bg-base-100 py-6">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 gap-8 pr-8"
            aria-hidden={copyIndex === 1}
          >
            {items.map(({ icon: Icon, title, desc }) => (
              <div
                key={`${copyIndex}-${title}`}
                className="flex w-72 shrink-0 gap-3 sm:w-80"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>

                <div>
                  <h3 className="font-semibold text-base-content">{title}</h3>

                  <p className="mt-0.5 text-sm leading-relaxed text-base-content/70">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStrip;
