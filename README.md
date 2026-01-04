# Meal Planner App

A Next.js web application that generates personalized weekly meal plans using OpenAI and stores them in PostgreSQL.

## Features

- **Personalized Meal Planning**: Generate lunch and dinner for 7 days
- **Nutritional Targeting**: Set specific calorie and protein goals
- **Dietary Preferences**: Support for various dietary restrictions and preferences
- **AI-Powered**: Uses OpenAI GPT-4 to create varied, balanced meals
- **Database Storage**: Stores meal plans and user data in PostgreSQL

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/caprover_recetas?schema=public"

# OpenAI
OPENAI_API_KEY="your_openai_api_key_here"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Fill out the form** with your personal information:
   - Name and email
   - Daily calorie target (1200-4000)
   - Daily protein target (50-300g)
   - Week start date
   - Dietary preferences and restrictions

2. **Click "Generate Meal Plan"** to create your personalized weekly meal plan

3. **View your meal plan** with detailed information for each meal including:
   - Nutritional information
   - Ingredients list
   - Cooking instructions

## Database Schema

- **Users**: Store user information
- **MealPlans**: Store meal plan metadata and targets
- **Meals**: Store individual meal details with nutritional info

## API Endpoints

- `POST /api/generate-meal-plan`: Generate and save a new meal plan

## Technologies Used

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma** for database ORM
- **PostgreSQL** for data storage
- **OpenAI GPT-4** for meal generation
- **Zod** for data validation
