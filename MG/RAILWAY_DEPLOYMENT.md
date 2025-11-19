# Railway Deployment Guide

This guide will help you deploy your Spring Boot + React application to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. A GitHub repository with your code
3. MySQL database (Railway provides this)

## Step 1: Prepare Your Repository

All necessary files have been created:
- `Procfile` - Tells Railway how to run your app
- `nixpacks.toml` - Build configuration
- Updated `build.gradle` - Frontend build tasks enabled
- Updated `application.properties` - Uses environment variables

## Step 2: Deploy to Railway

1. **Create a New Project on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Build Settings (Important!)**
   - In your Railway service, go to Settings
   - Under "Build Command", Railway should auto-detect, but if not, you can set:
     ```
     cd src/main/frontend && npm install && npm run build && cd ../../.. && ./gradlew bootJar -x test && chmod +x start.sh
     ```
   - Under "Start Command", set:
     ```
     bash start.sh
     ```
   - Or Railway should auto-detect from `Procfile` or `railway.json`

3. **Add MySQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "Add MySQL"
   - Railway will automatically create a MySQL database

3. **Configure Environment Variables**
   
   Go to your service → Variables tab and add:

   **Required Variables:**
   ```
   PORT=8080
   ```
   (Railway automatically sets PORT, but you can set it explicitly)

   **Database Variables (from Railway MySQL service):**
   - Railway automatically provides these, but verify:
   ```
   DATABASE_URL=<provided by Railway MySQL service>
   DB_USERNAME=<provided by Railway MySQL service>
   DB_PASSWORD=<provided by Railway MySQL service>
   ```

   **OpenAI API Key:**
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

   **Google OAuth (update with your production URLs):**
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=https://your-app-name.railway.app/login/oauth2/code/google
   ```

   **CORS Configuration:**
   ```
   ALLOWED_ORIGINS=https://your-app-name.railway.app
   ```
   (For local development, you can use: `http://localhost:3000,https://your-app-name.railway.app`)

   **Frontend API URL (optional, for separate frontend deployment):**
   ```
   REACT_APP_API_URL=https://your-app-name.railway.app
   ```

4. **Update Google OAuth Settings**
   - Go to Google Cloud Console
   - Add your Railway URL to authorized redirect URIs:
     `https://your-app-name.railway.app/login/oauth2/code/google`

5. **Deploy**
   - Railway will automatically detect your project
   - It will build using the `nixpacks.toml` configuration
   - The build process will:
     1. Install Node.js and Gradle
     2. Install frontend dependencies
     3. Build the React frontend
     4. Build the Spring Boot JAR
     5. Run the application

## Step 3: Verify Deployment

1. Check the Railway logs to ensure the build completed successfully
2. Visit your Railway URL (e.g., `https://your-app-name.railway.app`)
3. Test the application functionality

## Troubleshooting

### Build Fails
- Check Railway logs for specific errors
- Ensure all environment variables are set
- Verify `build.gradle` frontend tasks are working locally

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check MySQL service is running in Railway
- Ensure database credentials are correct

### CORS Errors
- Update `ALLOWED_ORIGINS` environment variable
- Include both your Railway domain and localhost for development

### Frontend Not Loading
- Check if React build completed successfully
- Verify `src/main/resources/static` contains built files
- Check Railway logs for build errors

## Notes

- Railway automatically provides a `$PORT` environment variable
- The application will be accessible at `https://your-app-name.railway.app`
- For production, consider:
  - Setting `spring.jpa.show-sql=false`
  - Using a production database
  - Securing your API keys
  - Setting up proper CORS origins

