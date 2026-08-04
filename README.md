# PERN E-commerce App

A full-stack e-commerce application built with the **PERN stack** as a practical project for learning modern application architecture and third-party service integrations.

The project focuses on integrating external services such as **Clerk** for authentication, **Polar** for checkout and payment processing, payment **webhooks** for updating order statuses, **ImageKit** for image management, **Stream** for customer support chat and video calls, and **Sentry** for application monitoring.

The application includes a product catalog, shopping cart, checkout flow, order management, role-based administration, and communication tools for customer support.

## ⚙️ Backend

The backend is built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**. It provides a REST API responsible for authentication, product and order management, payment processing, webhook handling, database operations, image management, monitoring, and customer support features.

### 🛠️ Technologies Used

* 🟦 **TypeScript** — static typing and safer backend development
* 🟢 **Node.js** — server-side JavaScript runtime
* 🚂 **Express 5** — REST API, routes, controllers, and middleware
* 🐘 **PostgreSQL** — relational database for users, products, orders, and checkout data
* 💧 **Drizzle ORM** — typed database schemas and database queries
* 🔐 **Clerk** — user authentication and backend authorization
* 💳 **Polar** — checkout and payment processing
* 🪝 **Webhooks** — payment confirmation and order status updates
* ✅ **Zod** — request body and input validation
* 🖼️ **ImageKit** — product image uploads, storage, and optimization
* 💬 **Stream Chat** — customer support chat between users and staff
* 📹 **Stream Video** — customer support video calls
* 📊 **Sentry** — error tracking, monitoring, and performance profiling
* 🌐 **CORS** — controlled communication between the frontend and backend
* 🧹 **ESLint** — code quality and consistent formatting

### 🔑 Backend Features

* User authentication and synchronization with Clerk
* Role-based access for customers, support staff, and administrators
* Product and category management
* Shopping cart and checkout processing
* Order creation and order history
* Polar payment integration
* Secure webhook verification
* Automatic order status updates after payment
* Product image uploads and optimization
* Customer support chat
* Customer support video calls
* Request validation with Zod
* Typed PostgreSQL queries with Drizzle ORM
* Centralized error handling
* Application monitoring with Sentry


## 🎨 Frontend

The frontend is built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. It provides a responsive interface for browsing products, managing the shopping cart, completing checkout, viewing orders, and communicating with customer support.

### 🛠️ Technologies Used

* ⚛️ **React 19** — component-based user interface
* 🟦 **TypeScript** — static typing and safer frontend development
* ⚡ **Vite** — development server and production build tool
* 🧭 **React Router** — client-side routing and nested application pages
* 🔐 **Clerk React** — authentication interface and user session management
* 🔄 **TanStack Query** — server state, API requests, caching, and mutations
* 🐻 **Zustand** — lightweight global state management for the shopping cart
* 🌐 **Axios** — communication with the backend REST API
* 🎨 **Tailwind CSS** — responsive styling and layout
* 🌼 **DaisyUI** — reusable themed UI components
* 🖼️ **ImageKit** — optimized product images through transformed image URLs
* 💬 **Stream Chat React** — customer support chat interface
* 📹 **Stream Video React SDK** — customer support video calls
* 📊 **Sentry React** — frontend error tracking and monitoring
* ✨ **Lucide React** — reusable interface icons
* 🧹 **ESLint** — code quality and consistent formatting

### ✨ Frontend Features

* Responsive product catalog
* Product search and category filtering
* Product detail pages
* Shopping cart with quantity management
* Clerk authentication and protected pages
* Polar checkout redirection
* Order history and order details
* Customer support chat
* Customer support video calls
* Role-based administration interface
* Product creation, editing, and deletion
* Product image upload and preview
* Server state caching with TanStack Query
* Persistent shopping cart state with Zustand
* Application monitoring with Sentry


## 🚀 Live Demo

The application is available online:

👉 [Open NorthShop Live Demo](https://northshop.onrender.com/)

### 💳 Test Payment

The checkout uses the **Polar Sandbox environment**, so no real payments are processed.

Please do not enter real payment card information. To test a successful checkout, use:

* **Card number:** `4242 4242 4242 4242`
* **Expiration date:** Any future date
* **CVC:** Any three-digit number
* **Other information:** Any test data

The payment is simulated, and no money will be charged.

🔗 [Learn more about the Polar Sandbox environment](https://polar.sh/docs/integrate/sandbox)


