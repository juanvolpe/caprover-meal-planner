import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateWeeklyMeals } from '@/lib/openai'
import { MealPlanRequest } from '@/app/types/meal-plan'
import { z } from 'zod'

const MealPlanRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  caloriesTarget: z.number().min(1200).max(4000),
  proteinTarget: z.number().min(50).max(300),
  preferences: z.array(z.string()),
  weekStartDate: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const validatedData = MealPlanRequestSchema.parse(body) as MealPlanRequest
    
    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
        }
      })
    }

    // Generate meals using OpenAI
    const generatedMeals = await generateWeeklyMeals({
      caloriesTarget: validatedData.caloriesTarget,
      proteinTarget: validatedData.proteinTarget,
      preferences: validatedData.preferences,
    })

    // Create meal plan in database
    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        name: validatedData.name + "'s Meal Plan",
        caloriesTarget: validatedData.caloriesTarget,
        proteinTarget: validatedData.proteinTarget,
        preferences: validatedData.preferences,
        weekStartDate: new Date(validatedData.weekStartDate),
        meals: {
          create: generatedMeals.map(meal => ({
            dayOfWeek: meal.dayOfWeek,
            mealType: meal.mealType,
            name: meal.name,
            description: meal.description,
            calories: meal.calories,
            protein: meal.protein,
            ingredients: meal.ingredients,
            instructions: meal.instructions,
          }))
        }
      },
      include: {
        meals: true,
      }
    })

    // Format response
    const response = {
      id: mealPlan.id,
      name: mealPlan.name,
      caloriesTarget: mealPlan.caloriesTarget,
      proteinTarget: mealPlan.proteinTarget,
      preferences: mealPlan.preferences,
      weekStartDate: mealPlan.weekStartDate.toISOString().split('T')[0],
      meals: mealPlan.meals.map(meal => ({
        id: meal.id,
        dayOfWeek: meal.dayOfWeek,
        mealType: meal.mealType,
        name: meal.name,
        description: meal.description,
        calories: meal.calories,
        protein: meal.protein,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
      })),
      createdAt: mealPlan.createdAt.toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in generate-meal-plan API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    )
  }
}
