import {
  type LucideIcon,
  CreditCardIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";

type ItemsProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const items: ItemsProps[] = [
  {
    icon: TruckIcon,
    title: "Fulfillment",
    desc: "Structured catalog & inventory-ready model",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure pay",
    desc: "Encrypted payments and order confirmation",
  },
  {
    icon: CreditCardIcon,
    title: "Transparent",
    desc: "Prices in EUR, tax where applicable",
  },
  {
    icon: HeadphonesIcon,
    title: "Human support",
    desc: "Order-scoped chat + optional video",
  },
];

const TrustStrip = () => {
  return (
    <section className="grid gap-4 rounded-box border border-base-300 bg-base-100 p-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </div>

          <div>
            <h3 className="font-semibold text-base-content">{title}</h3>
            <p className="mt-0.5 text-sm text-base-content">{desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default TrustStrip;
