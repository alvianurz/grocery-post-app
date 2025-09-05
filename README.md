# Grocery Point of Sale System

A modern full-stack web application for grocery stores built with Next.js 15, featuring customer ordering, real-time order management, inventory control, and Bluetooth receipt printing.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router with Turbopack)
- **Language:** TypeScript
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Theme System:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Bluetooth Printing:** Web Bluetooth API

## Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- Docker and Docker Compose (for database setup)
- Generated project documents from [CodeGuide](https://codeguide.dev/) for best development experience

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeguide-starter-fullstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables Setup**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - The default values work with Docker setup, modify as needed

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.**

## Configuration

### Option 1: Docker Setup (Recommended)
1. **Start PostgreSQL with Docker:**
   ```bash
   npm run db:up
   ```
   This starts PostgreSQL in a Docker container with default credentials.

2. **Push database schema:**
   ```bash
   npm run db:push
   ```

### Option 2: Local Database Setup
1. Create a PostgreSQL database locally
2. Update your environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   POSTGRES_DB=your_database_name
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```
3. Run database migrations:
   ```bash
   npm run db:push
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (defaults work with Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Admin Credentials (for development only)
NEXT_PUBLIC_ADMIN_EMAIL=admin@store.com
NEXT_PUBLIC_ADMIN_PASSWORD=password
```

## Features

- 🛒 **Customer Ordering System**
  - Simple customer registration with name and phone number
  - Product catalog with category browsing
  - Real-time product search
  - Shopping cart functionality
  - Order placement and confirmation

- 🧾 **Admin Order Management**
  - Real-time order dashboard
  - Order status tracking (Pending, Ready for Pickup, Completed)
  - Detailed order views with customer information
  - Bluetooth thermal receipt printing
  - Order status updates

- 📦 **Inventory Management**
  - Product CRUD operations
  - Category management
  - Stock quantity tracking
  - Price management

- 📊 **Sales Analytics**
  - Daily sales tracking
  - Order statistics by status
  - Recent orders overview

- 🔐 Authentication with Better Auth (email/password)
- 🗄️ PostgreSQL Database with Drizzle ORM
- 🎨 40+ shadcn/ui components (New York style)
- 🌙 Dark mode with system preference detection
- 🚀 App Router with Server Components and Turbopack
- 📱 Responsive design with TailwindCSS v4
- 🎯 Type-safe database operations
- 🔒 Modern authentication patterns
- 🐳 Full Docker support with multi-stage builds
- 🚀 Production-ready deployment configuration

## Project Structure

```
codeguide-starter-fullstack/
├── app/                        # Next.js app router pages
│   ├── admin/                # Admin dashboard pages
│   │   ├── orders/           # Order management
│   │   ├── products/         # Product management
│   │   ├── categories/       # Category management
│   │   ├── analytics/        # Sales analytics
│   │   ├── login/            # Admin login
│   │   ├── layout.tsx        # Admin layout
│   │   └── page.tsx          # Admin dashboard
│   ├── catalog/              # Customer product catalog
│   ├── cart/                 # Customer shopping cart
│   ├── customer-info/        # Customer registration
│   ├── order-confirmation/   # Order confirmation
│   ├── api/                  # API routes
│   ├── globals.css            # Global styles with dark mode
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main page
├── components/                # React components
│   └── ui/                    # shadcn/ui components (40+)
├── db/                        # Database configuration
│   ├── index.ts              # Database connection
│   └── schema/               # Database schemas
├── docker/                    # Docker configuration
│   └── postgres/             # PostgreSQL initialization
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions
│   ├── auth.ts               # Better Auth configuration
│   ├── bluetooth-printer.ts  # Bluetooth printing utilities
│   └── utils.ts              # General utilities
├── auth-schema.ts            # Authentication schema
├── docker-compose.yml        # Docker services configuration
├── Dockerfile                # Application container definition
├── drizzle.config.ts         # Drizzle configuration
└── components.json           # shadcn/ui configuration
```

## Database Integration

This starter includes modern database integration:

- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** as the database provider
- **Better Auth** integration with Drizzle adapter
- **Database migrations** with Drizzle Kit

## Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:dev` - Start development PostgreSQL (port 5433)
- `npm run db:dev-down` - Stop development PostgreSQL
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop all tables and recreate)

### Authentication
- `npm run setup:admin` - Create admin user with credentials from environment variables

### Styling with shadcn/ui
- Pre-configured with 40+ shadcn/ui components in New York style
- Components are fully customizable and use CSS variables for theming
- Automatic dark mode support with next-themes integration
- Add new components: `npx shadcn@latest add [component-name]`

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack (app + database)
- `npm run docker:down` - Stop all containers
- `npm run docker:logs` - View container logs
- `npm run docker:clean` - Stop containers and clean up volumes

## Docker Development

### Quick Start with Docker
```bash
# Start the entire stack (recommended for new users)
npm run docker:up

# View logs
npm run docker:logs

# Stop everything
npm run docker:down
```

### Development Workflow
```bash
# Option 1: Database only (develop app locally)
npm run db:up          # Start PostgreSQL
npm run dev            # Start Next.js development server

# Option 2: Full Docker stack
npm run docker:up      # Start both app and database
```

### Docker Services

The `docker-compose.yml` includes:

- **postgres**: Main PostgreSQL database (port 5432)
- **postgres-dev**: Development database (port 5433) - use `--profile dev`
- **app**: Next.js application container (port 3000)

### Docker Profiles

```bash
# Start development database on port 5433
docker-compose --profile dev up postgres-dev -d

# Or use the npm script
npm run db:dev
```

## Deployment

### Production Deployment

#### Option 1: Docker Compose (VPS/Server)

1. **Clone and setup on your server:**
   ```bash
   git clone <your-repo>
   cd codeguide-starter-fullstack
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```bash
   # Edit .env with production values
   DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/postgres
   POSTGRES_DB=postgres
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   BETTER_AUTH_SECRET=your-very-secure-secret-key
   BETTER_AUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com
   ```

3. **Deploy:**
   ```bash
   npm run docker:up
   ```

#### Option 2: Container Registry (AWS/GCP/Azure)

1. **Build and push image:**
   ```bash
   # Build the image
   docker build -t your-registry/codeguide-starter-fullstack:latest .
   
   # Push to registry
   docker push your-registry/codeguide-starter-fullstack:latest
   ```

2. **Deploy using your cloud provider's container service**

#### Option 3: Vercel + External Database

1. **Setup external PostgreSQL database:**
   - Choose a managed PostgreSQL service (e.g., Supabase, Railway, Neon, or AWS RDS)
   - Create a new database and get the connection string

2. **Configure environment variables:**
   ```env
   DATABASE_URL=your_managed_postgresql_connection_string
   BETTER_AUTH_SECRET=generate_a_secure_32_character_key
   BETTER_AUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_BETTER_AUTH_URL=https://your-app.vercel.app
   ```

3. **Push database schema:**
   ```bash
   npm run db:push
   ```

4. **Deploy to Vercel:**
   - Push your code to a GitHub repository
   - Connect the repository to Vercel
   - Add the environment variables in the Vercel dashboard
   - Deploy the application

5. **Create admin user:**
   ```bash
   npm run setup:admin
   ```
   Or manually create an admin user through the application's signup process.

#### Redeployment to Vercel

To redeploy your application to Vercel after making changes:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin main
   ```

2. **Trigger redeployment:**
   - Vercel will automatically deploy when you push to your connected GitHub repository
   - Alternatively, you can trigger redeployment manually from the Vercel dashboard

### Environment Variables for Production

```env
# Required for production
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=generate-a-very-secure-32-character-key
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com

# Optional optimizations
NODE_ENV=production
```

### Production Considerations

- **Database**: Use managed PostgreSQL (Supabase, Railway, Neon, AWS RDS, etc.)
- **Security**: 
  - Generate strong secrets for `BETTER_AUTH_SECRET`
  - Use HTTPS in production
  - Never commit sensitive values to version control
- **Performance**: Enable Next.js output: 'standalone' for smaller containers
- **Monitoring**: Add logging and health checks
- **Backup**: Regular database backups
- **SSL**: Terminate SSL at load balancer or reverse proxy

### Health Checks

The application includes basic health checks. You can extend them:

```dockerfile
# In Dockerfile, add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

## AI Coding Agent Integration

This starter is optimized for AI coding agents:

- **Clear file structure** and naming conventions
- **TypeScript integration** with proper type definitions
- **Modern authentication** patterns
- **Database schema** examples

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
