# Restaurant Menu Management App

A full-stack restaurant menu management web application built with Next.js, Prisma, and PostgreSQL.

## Features

- **User Authentication**: Login system with email and password using Prisma User table
- **Menu Management**: Three categories - Grill, Salads, and Drinks
- **Admin Panel**: Authenticated admin users can add, edit, and delete menu items
- **Public Menu**: Visitors (not logged in) can view the menu grouped by category

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up your database connection:

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db?schema=public"
```

Replace `user`, `password`, `localhost`, `5432`, and `restaurant_db` with your PostgreSQL credentials.

3. Set up the database:

```bash
# Generate Prisma Client
pnpm db:generate

# Push the schema to your database
pnpm db:push

# Seed the database with initial data (admin user and sample menu items)
pnpm db:seed
```

4. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Default Credentials

After seeding the database, you can login with:

- **Email**: `admin@restaurant.com`
- **Password**: `admin123`

## Database Commands

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema changes to database (for development)
- `pnpm db:migrate` - Create and run migrations (for production)
- `pnpm db:seed` - Seed the database with initial data
- `pnpm db:studio` - Open Prisma Studio to view/edit database

## Project Structure

```
app/
  api/              # API routes
    auth/          # Authentication endpoints
    menu/          # Menu CRUD endpoints
  components/      # React components
  contexts/        # React contexts (Auth, Menu)
  admin/           # Admin panel page
  login/           # Login page
  page.tsx         # Public menu page
lib/
  prisma.ts        # Prisma client instance
prisma/
  schema.prisma    # Database schema
  seed.ts          # Database seed script
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
