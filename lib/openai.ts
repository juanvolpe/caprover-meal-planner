import OpenAI from 'openai'

// Create OpenAI client only when API key is available
let openai: OpenAI | null = null

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
} else {
  console.warn('OPENAI_API_KEY is not set in environment variables')
}

export { openai }

export interface MealGenerationRequest {
  caloriesTarget: number
  proteinTarget: number
  preferences: string[]
}

export interface GeneratedMeal {
  dayOfWeek: number
  mealType: 'LUNCH' | 'DINNER'
  name: string
  description: string
  calories: number
  protein: number
  ingredients: string[]
  instructions: string
}

export async function generateWeeklyMeals(request: MealGenerationRequest): Promise<GeneratedMeal[]> {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Please check your OPENAI_API_KEY environment variable.')
  }

  const { caloriesTarget, proteinTarget, preferences } = request
  
  // Calculate target calories per meal (assuming lunch and dinner split)
  const caloriesPerMeal = Math.round(caloriesTarget / 2)
  const proteinPerMeal = Math.round(proteinTarget / 2)
  
  const preferencesText = preferences.length > 0 
    ? `Dietary preferences and restrictions: ${preferences.join(', ')}`
    : 'No specific dietary preferences'

  const prompt = `Generate a complete 7-day meal plan with lunch and dinner for each day (14 meals total).

Requirements:
- Daily calorie target: ${caloriesTarget} calories
- Daily protein target: ${proteinTarget}g protein
- Target per meal: ~${caloriesPerMeal} calories, ~${proteinPerMeal}g protein
- ${preferencesText}

For each meal, provide:
1. A creative, appealing name
2. A brief description (1-2 sentences)
3. Estimated calories
4. Estimated protein in grams
5. List of main ingredients (5-8 items)
6. Brief cooking instructions (2-3 sentences)

Ensure variety across the week and balance the nutritional targets. Make meals practical and achievable for home cooking.

Return the response as a JSON array with this exact structure:
[
  {
    "dayOfWeek": 0,
    "mealType": "LUNCH",
    "name": "Meal Name",
    "description": "Brief description",
    "calories": 500,
    "protein": 25,
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "instructions": "Cooking instructions"
  }
]

Days: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
Meal types: "LUNCH" or "DINNER"

Generate all 14 meals (7 lunches + 7 dinners) in the JSON array.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and chef. Generate practical, balanced meal plans that meet specific nutritional targets. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the JSON response
    const meals = JSON.parse(content) as GeneratedMeal[]
    
    // Validate the response
    if (!Array.isArray(meals) || meals.length !== 14) {
      throw new Error('Invalid meal plan structure received')
    }

    return meals
  } catch (error) {
    console.error('Error generating meals with OpenAI:', error)
    throw new Error('Failed to generate meal plan')
  }
}
