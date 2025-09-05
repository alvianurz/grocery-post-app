# Deployment Checklist

## Pre-deployment

- [ ] Update all environment variables in `.env.production`
- [ ] Generate a secure `BETTER_AUTH_SECRET` (32+ characters)
- [ ] Set up external PostgreSQL database (Supabase, Railway, Neon, etc.)
- [ ] Test database connection locally
- [ ] Run database migrations (`npm run db:push`)
- [ ] Create admin user (`npm run setup:admin`)
- [ ] Test authentication locally
- [ ] Run build locally (`npm run build`)
- [ ] Test production build locally (`npm start`)

## Vercel Deployment

- [ ] Push code to GitHub repository
- [ ] Connect repository to Vercel
- [ ] Add environment variables in Vercel dashboard:
  - `DATABASE_URL`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL`
  - `NEXT_PUBLIC_BETTER_AUTH_URL`
- [ ] Configure custom domain (if needed)
- [ ] Set up environment-specific variables (preview/production)
- [ ] Enable automatic deployments (or manual if preferred)

## Post-deployment

- [ ] Test application accessibility
- [ ] Test admin login
- [ ] Test customer flow (registration, ordering)
- [ ] Test API endpoints
- [ ] Verify database connectivity
- [ ] Check error logs
- [ ] Set up monitoring (if needed)
- [ ] Configure SSL/HTTPS (automatic with Vercel)
- [ ] Test on different devices/browsers

## Security Considerations

- [ ] Ensure `BETTER_AUTH_SECRET` is truly random and secure
- [ ] Use HTTPS in production
- [ ] Set up proper CORS policies
- [ ] Implement rate limiting (if needed)
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Performance Optimization

- [ ] Enable Next.js Image Optimization
- [ ] Use ISR/SSG where appropriate
- [ ] Implement proper caching strategies
- [ ] Optimize database queries
- [ ] Monitor bundle sizes
- [ ] Set up CDN (automatic with Vercel)

## Backup and Monitoring

- [ ] Set up database backups
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Implement logging
- [ ] Set up alerts for critical errors