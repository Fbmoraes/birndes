# Vercel Deployment Guide for PrintsBrindes Website

## Overview
This guide will help you deploy your PrintsBrindes website to Vercel with full database functionality and responsive design.

## Prerequisites
- Vercel account (free tier is sufficient)
- GitHub account
- Your website files

## Step 1: Prepare Your Repository

1. **Create a new GitHub repository** or use an existing one
2. **Upload your website files** to the repository
3. **Ensure all files are committed** including:
   - `vercel.json` (deployment configuration)
   - `app/api/` folder (API endpoints)
   - Updated components with responsive design
   - `next.config.mjs` (updated for Vercel deployment)

## Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings:**
   - Framework Preset: Next.js
   - Root Directory: `./` (if files are in root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

## Step 3: Environment Variables (Optional)

If you plan to upgrade to a PostgreSQL database later:

1. **Go to Project Settings** in Vercel dashboard
2. **Navigate to Environment Variables**
3. **Add the following variables:**
   ```
   NODE_ENV=production
   ```

## Step 4: Deploy

1. **Click "Deploy"** in Vercel
2. **Wait for deployment** to complete (usually 2-3 minutes)
3. **Your website will be available** at `https://your-project-name.vercel.app`

## Step 5: Configure Custom Domain (Optional)

1. **Go to Project Settings** → **Domains**
2. **Add your custom domain** (e.g., printsbrindes.com.br)
3. **Follow Vercel's DNS configuration** instructions

## Features Included

### ✅ Responsive Design
- Mobile-friendly navigation with hamburger menu
- Responsive layouts for all screen sizes
- Touch-friendly interface

### ✅ Data Persistence
- Server-side data storage
- Administrative changes persist across devices
- Automatic data synchronization

### ✅ Administrative Panel
- Secure login system
- Product management (add, edit, delete)
- Catalog management
- Settings configuration

### ✅ Performance Optimized
- Fast loading times
- Optimized images
- SEO-friendly structure

## Post-Deployment Steps

1. **Test the website** on different devices
2. **Verify administrative functions** work correctly
3. **Check mobile responsiveness**
4. **Test data persistence** by making changes and refreshing

## Troubleshooting

### Common Issues:

1. **Build Errors:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript types are correct

2. **API Not Working:**
   - Verify `vercel.json` configuration
   - Check API routes are in correct folders

3. **Mobile Menu Not Showing:**
   - Clear browser cache
   - Check that responsive header component is being used

### Getting Help:

- Check Vercel deployment logs in the dashboard
- Review browser console for JavaScript errors
- Ensure all files are properly uploaded to GitHub

## Upgrading to PostgreSQL (Future)

When you're ready to upgrade from file-based storage to PostgreSQL:

1. **Set up a PostgreSQL database** (Supabase, PlanetScale, or Vercel Postgres)
2. **Update API routes** to use database connections
3. **Add database environment variables** to Vercel
4. **Migrate existing data** to the new database

## Support

For technical support or questions about the deployment:
- Check the Vercel documentation
- Review the project's README file
- Contact your developer for custom modifications

---

**Your PrintsBrindes website is now ready for production use with full responsive design and data persistence!**

