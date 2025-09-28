# Kakeibo Deployment Guide

## 🚀 Complete Deployment Instructions

Your Kakeibo application is ready for deployment! Follow these steps to get it running in production.

### 1. Database Setup (Supabase) ✅

Your Supabase project is already configured. You'll need to use your actual credentials from your `.env.local` file.

**Manual Steps Required:**

1. Go to your Supabase Dashboard: https://app.supabase.com/
2. Navigate to your project's **SQL Editor**
3. Run the database initialization script:
   - Copy and paste the contents of `database/init.sql`
   - Click "Run" to create all tables
4. Run the security policies:
   - Copy and paste the contents of `database/rls_policies.sql`
   - Click "Run" to enable row-level security

### 2. Frontend Deployment (Vercel) 🌐

#### Option A: Deploy via GitHub (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Sign in and click "New Project"
3. Import from GitHub: `WeBot-IT-Services/Kakeibo`
4. Configure environment variables in Vercel dashboard using your actual values from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-deployment-url.vercel.app
   ```
5. Click "Deploy"

#### Option B: Deploy via CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts

### 3. Post-Deployment Configuration 🔧

1. **Update NEXTAUTH_URL**: After deployment, update the `NEXTAUTH_URL` environment variable in Vercel with your actual deployment URL
2. **Update Supabase Auth Settings**:
   - Go to Supabase → Authentication → Settings
   - Add your deployment URL to "Site URL"
   - Add your deployment URL to "Redirect URLs"

### 4. Verification Checklist ✅

After deployment, verify these features work:
- [ ] User registration and login
- [ ] Dashboard displays correctly
- [ ] Account creation and management
- [ ] Transaction creation and listing
- [ ] Category management
- [ ] Receipt scanning (AI features)
- [ ] Profile management

### 5. Alternative Deployment Options

#### Netlify
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

#### Railway
1. Connect GitHub repository to Railway
2. Railway will auto-detect Next.js
3. Add environment variables
4. Deploy

## 📝 Notes

- **Database**: Supabase (PostgreSQL) - already configured
- **Authentication**: Supabase Auth with NextAuth.js integration
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **AI Features**: OpenAI integration for receipt processing

## 🔗 Important Links

- **GitHub Repository**: https://github.com/WeBot-IT-Services/Kakeibo
- **Supabase Dashboard**: https://app.supabase.com/
- **Documentation**: See `docs/` folder for detailed setup guides

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure database tables are created successfully
4. Check Supabase logs for database errors

---

🎉 **Your Kakeibo app is ready to help users manage their finances!**