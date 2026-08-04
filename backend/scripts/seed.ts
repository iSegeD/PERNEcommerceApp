import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { products } from "../src/db/schema.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const CATALOG = [
  // Mobile
  {
    slug: "everyday-smartphone",
    name: "Everyday Smartphone",
    category: "Mobile",
    description:
      "A modern smartphone with a bright display, fast performance, reliable cameras, and enough battery for a full day.",
    priceCents: 59900,
    imageUrl:
      "https://images.pexels.com/photos/10902918/pexels-photo-10902918.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "11-inch-tablet",
    name: "11-inch Tablet",
    category: "Mobile",
    description:
      "A lightweight tablet for watching videos, reading, browsing, studying, and handling everyday tasks.",
    priceCents: 34900,
    imageUrl:
      "https://images.pexels.com/photos/8533349/pexels-photo-8533349.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "phone-tripod",
    name: "Phone Tripod",
    category: "Mobile",
    description:
      "A compact adjustable tripod for taking photos, recording videos, joining calls, and creating content.",
    priceCents: 3900,
    imageUrl:
      "https://images.pexels.com/photos/11809789/pexels-photo-11809789.jpeg?auto=compress&cs=tinysrgb&w=800",
  },

  // Computers
  {
    slug: "14-inch-laptop",
    name: "14-inch Laptop",
    category: "Computers",
    description:
      "A slim everyday laptop suitable for work, studying, browsing, video calls, and entertainment.",
    priceCents: 89900,
    imageUrl:
      "https://images.pexels.com/photos/15940010/pexels-photo-15940010.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "27-inch-monitor",
    name: "27-inch Monitor",
    category: "Computers",
    description:
      "A clear and spacious monitor for office work, studying, creative projects, and casual gaming.",
    priceCents: 27900,
    imageUrl:
      "https://images.pexels.com/photos/1714340/pexels-photo-1714340.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "mini-desktop-computer",
    name: "Mini Desktop Computer",
    category: "Computers",
    description:
      "A compact desktop computer that provides reliable performance without taking up much desk space.",
    priceCents: 54900,
    imageUrl:
      "https://images.pexels.com/photos/28297692/pexels-photo-28297692.jpeg?auto=compress&cs=tinysrgb&w=800",
  },

  // Gaming
  {
    slug: "wireless-game-controller",
    name: "Wireless Game Controller",
    category: "Gaming",
    description:
      "A comfortable wireless controller with responsive buttons and a familiar layout for long gaming sessions.",
    priceCents: 6900,
    imageUrl:
      "https://images.pexels.com/photos/16311110/pexels-photo-16311110.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "comfort-gaming-chair",
    name: "Comfort Gaming Chair",
    category: "Gaming",
    description:
      "An adjustable gaming chair with a high back, padded armrests, and comfortable support for longer sessions.",
    priceCents: 24900,
    imageUrl:
      "https://images.unsplash.com/photo-1770195483917-b3bb444b7a29?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    slug: "usb-streaming-microphone",
    name: "USB Streaming Microphone",
    category: "Gaming",
    description:
      "A simple USB microphone for gaming, streaming, podcasts, voice recordings, and online meetings.",
    priceCents: 11900,
    imageUrl:
      "https://images.pexels.com/photos/20461204/pexels-photo-20461204.jpeg?auto=compress&cs=tinysrgb&w=800",
  },

  // Kitchen
  {
    slug: "home-espresso-machine",
    name: "Home Espresso Machine",
    category: "Kitchen",
    description:
      "A compact coffee machine for preparing espresso, cappuccino, and other café-style drinks at home.",
    priceCents: 29900,
    imageUrl:
      "https://images.pexels.com/photos/6612626/pexels-photo-6612626.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "two-slice-toaster",
    name: "Two-Slice Toaster",
    category: "Kitchen",
    description:
      "A simple two-slice toaster with adjustable browning levels and easy-to-use controls.",
    priceCents: 5900,
    imageUrl:
      "https://images.pexels.com/photos/7936648/pexels-photo-7936648.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "smoothie-blender",
    name: "Smoothie Blender",
    category: "Kitchen",
    description:
      "A practical kitchen blender for smoothies, sauces, soups, and everyday food preparation.",
    priceCents: 8900,
    imageUrl:
      "https://images.pexels.com/photos/6824660/pexels-photo-6824660.jpeg?auto=compress&cs=tinysrgb&w=800",
  },

  // Fitness
  {
    slug: "exercise-mat",
    name: "Exercise Mat",
    category: "Fitness",
    description:
      "A soft non-slip mat for stretching, yoga, home workouts, and floor exercises.",
    priceCents: 3900,
    imageUrl:
      "https://images.pexels.com/photos/16143599/pexels-photo-16143599.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "resistance-band-set",
    name: "Resistance Band Set",
    category: "Fitness",
    description:
      "A lightweight set of exercise bands for strength training, stretching, and home workouts.",
    priceCents: 2900,
    imageUrl:
      "https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    slug: "massage-gun",
    name: "Massage Gun",
    category: "Fitness",
    description:
      "A portable massage device designed to relax tired muscles after exercise or a long working day.",
    priceCents: 12900,
    imageUrl:
      "https://images.unsplash.com/photo-1755255020813-1cdb6a4bd9b0?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  // Smart Home
  {
    slug: "robot-vacuum",
    name: "Robot Vacuum",
    category: "Smart Home",
    description:
      "An automatic vacuum that handles everyday floor cleaning and returns to its charger when finished.",
    priceCents: 32900,
    imageUrl:
      "https://images.pexels.com/photos/8566433/pexels-photo-8566433.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    slug: "smart-led-bulb",
    name: "Smart LED Bulb",
    category: "Smart Home",
    description:
      "An energy-saving LED bulb with adjustable brightness and convenient control from your phone.",
    priceCents: 2400,
    imageUrl:
      "https://images.unsplash.com/photo-1532007271951-c487760934ae?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    slug: "indoor-security-camera",
    name: "Indoor Security Camera",
    category: "Smart Home",
    description:
      "A compact indoor camera for checking your home remotely and receiving motion notifications.",
    priceCents: 7900,
    imageUrl:
      "https://images.pexels.com/photos/32769440/pexels-photo-32769440.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const main = async () => {
  const rows = CATALOG.map((item) => ({
    slug: item.slug,
    name: item.name,
    category: item.category,
    description: item.description,
    priceCents: item.priceCents,
    currency: "eur",
    imageUrl: item.imageUrl,
    active: true,
  }));

  for (const row of rows) {
    await db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: row.name,
          category: row.category,
          description: row.description,
          priceCents: row.priceCents,
          currency: row.currency,
          imageUrl: row.imageUrl,
          active: row.active,
        },
      });
  }
  console.log(`Seed complete (${CATALOG.length} products upserted).`);
  await pool.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
