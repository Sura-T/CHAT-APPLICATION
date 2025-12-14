# Deployment Guide

This guide will help you deploy the Chat Application with the frontend on Vercel and backend on Railway.

## Prerequisites

- GitHub account with your code pushed to a repository
- MongoDB database (local or MongoDB Atlas)
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)

## Step 1: Prepare Environment Variables

### Backend Environment Variables (for Railway)
- `MONGO_DB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string (you already have one)
- `CLIENT_URL` - Your Vercel frontend URL (add after deploying frontend)
- `NODE_ENV` - Set to `production`
- `PORT` - Railway sets this automatically, but defaults to 5000

### Frontend Environment Variables (for Vercel)
- `VITE_API_URL` - Your Railway backend URL (e.g., `https://your-app.up.railway.app`)
- `VITE_SOCKET_URL` - Same as VITE_API_URL

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add Environment Variables in the Variables tab:
   ```
   MONGO_DB_URI=your_mongodb_connection_string
   JWT_SECRET=8fc6b474de407abf9f20dc1e92bd37e8af36a1e55d622cdc8634be1283298ebc
   NODE_ENV=production
   CLIENT_URL=http://localhost:3000
   ```
   (You'll update CLIENT_URL after deploying frontend)

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `VITE_API_URL` = Your Railway backend URL
   - `VITE_SOCKET_URL` = Your Railway backend URL (same as above)

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update Backend CORS

1. Go back to Railway dashboard
2. Update the `CLIENT_URL` environment variable:
   - If you want to allow only production: `https://your-app.vercel.app`
   - If you want to allow preview deployments too: `https://your-app.vercel.app,https://*.vercel.app`
   - You can add multiple URLs separated by commas

3. Railway will automatically redeploy with the new environment variable

## Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try signing up/logging in
3. Test sending messages
4. Check that Socket.IO connections work (online users, real-time messages)

## Troubleshooting

### CORS Errors
- Make sure `CLIENT_URL` in Railway includes your exact Vercel URL
- Check that credentials are included in fetch calls (already done)
- Verify CORS headers are set correctly (already configured)

### Socket.IO Connection Issues
- Ensure `VITE_SOCKET_URL` matches your Railway backend URL
- Check that Socket.IO CORS is configured to accept your frontend origin
- Verify WebSocket connections aren't blocked by firewall/proxy

### Environment Variables Not Working
- For Vite: Variables must start with `VITE_` to be exposed to frontend
- Restart the build after adding new environment variables
- Clear browser cache if changes aren't reflected

### MongoDB Connection Issues
- Verify `MONGO_DB_URI` is correct
- For MongoDB Atlas: Make sure your IP is whitelisted (or use 0.0.0.0/0 for testing)
- Check that database user has proper permissions

## Notes

- The patch for `buffer-equal-constant-time` will be automatically applied via the `postinstall` script
- Frontend static files are also served by the backend (fallback), but Vercel serves them primarily
- All API calls use the `API_BASE_URL` from environment variables
- Cookies are configured to work with cross-origin requests (credentials: "include")

