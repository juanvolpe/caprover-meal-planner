export interface MealPlanRequest {
  name: string
  email: string
  caloriesTarget: number
  proteinTarget: number
  preferences: string[]
  weekStartDate: string
}

export interface Meal {
  id: string
  dayOfWeek: number
  mealType: 'LUNCH' | 'DINNER'
  name: string
  description?: string
  calories: number
  protein: number
  ingredients: string[]
  instructions?: string
}

export interface MealPlan {
  id: string
  name: string
  caloriesTarget: number
  proteinTarget: number
  preferences: string[]
  weekStartDate: string
  meals: Meal[]
  createdAt: string
}
