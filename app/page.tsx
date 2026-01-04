'use client'

import { useState } from 'react'
import MealPlanForm from './components/meal-plan-form'
import MealPlanDisplay from './components/meal-plan-display'
import { MealPlan } from './types/meal-plan'

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleMealPlanGenerated = (plan: MealPlan) => {
    setMealPlan(plan)
    setIsGenerating(false)
  }

  const handleGenerateStart = () => {
    setIsGenerating(true)
    setMealPlan(null)
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create Your Meal Plan
        </h2>
        <MealPlanForm 
          onMealPlanGenerated={handleMealPlanGenerated}
          onGenerateStart={handleGenerateStart}
          isGenerating={isGenerating}
        />
      </div>

      {isGenerating && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Generating your meal plan...</span>
          </div>
        </div>
      )}

      {mealPlan && !isGenerating && (
        <MealPlanDisplay mealPlan={mealPlan} />
      )}
    </div>
  )
}
