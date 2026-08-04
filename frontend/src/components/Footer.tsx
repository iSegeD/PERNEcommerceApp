import { Link } from "react-router";
import { HeadphonesIcon, TruckIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold text-base-content">
              <TruckIcon className="size-8 text-primary" aria-hidden />
              NorthShop
            </div>
            <p className="mt-3 text-sm leading-relaxed text-base-content/65">
              An educational e-commerce project demonstrating product browsing,
              secure checkout, order management, and customer support features.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Shop
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="link link-hover text-base-content/80">
                  Browse products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="link link-hover text-base-content/80"
                >
                  Shopping cart
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="link link-hover text-base-content/80"
                >
                  My orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              Order support
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-base-content/70">
              <li className="flex items-start gap-2">
                <HeadphonesIcon
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>
                  Support chat is available for paid orders. Video call links
                  can also be shared in the same conversation.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
              About the project
            </h3>
            <p className="mt-3 text-sm text-base-content/65">
              Built as a portfolio project to demonstrate a complete shopping
              flow, third-party integrations, and a responsive user interface.
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-base-300 pt-6">
          <p className="text-center text-xs leading-relaxed text-base-content/50">
            © {new Date().getFullYear()} This project was created solely for
            educational and portfolio purposes and is not intended for
            commercial use. Products, prices, and store content are shown for
            demonstration only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
