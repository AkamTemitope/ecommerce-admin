# E-Commerce Dashboard & CMS with Next.js 13

**Key Features:**

- Admin dashboard serving as CMS, Admin, and API.
- Control multiple stores through a single CMS.
- Manage categories, products, filters, and billboards easily.
- Upload multiple images for products.
- Search functionality with pagination.
- Set featured products for homepage display.
- Graphs for revenue tracking.
- Integrated Clerk Authentication.
- Order creation and Stripe checkout.
- Stripe webhook integration.

**Setup:**

1. Create a `.env` file and configure the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/


DATABASE_URL=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=

FRONTEND_STORE_URL=http://localhost:3001
```

2. Connect to the Database and Push Prisma:

```shell
npx prisma generate
npx prisma db push
```

3. Start the application:

```shell
npm run dev
```
