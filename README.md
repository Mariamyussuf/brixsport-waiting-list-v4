# Brixsports waiting list

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mariamyussufs-projects/v0-brixsports-waiting-list)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/DOAti8uDt2v)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/mariamyussufs-projects/v0-brixsports-waiting-list](https://vercel.com/mariamyussufs-projects/v0-brixsports-waiting-list)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/DOAti8uDt2v](https://v0.app/chat/projects/DOAti8uDt2v)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Email Functionality

This project now includes email confirmation functionality using Resend. When a user signs up for the waitlist, they will receive a confirmation email with the following content:

> With Brixsports, matches are stories. Stats are tied to your campus, your players, your rivalries. The meaning is amplified because the community already knows the people on the field.
> 
> Brixsports' match feed isn't about passively 'checking scores' like Livescores. It's about living the match in real time inside your campus bubble, powered by people who are actually there.

## Setup Instructions

1. Create a free account at [Resend.com](https://resend.com)
2. Obtain your API key from the Resend dashboard
3. Update the `.env` file with your Resend API key:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```
4. For local development, also ensure you have your Supabase credentials in the `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
5. Run the database migration scripts in the `scripts/` directory to update your Supabase schema

## Running the Project

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```