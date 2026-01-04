'use client'

import { MealPlan, Meal } from '../types/meal-plan'

interface MealPlanDisplayProps {
  mealPlan: MealPlan
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export default function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  const getMealsByDay = (dayOfWeek: number) => {
    return mealPlan.meals.filter(meal => meal.dayOfWeek === dayOfWeek)
  }

  const getMealByType = (meals: Meal[], type: 'LUNCH' | 'DINNER') => {
    return meals.find(meal => meal.mealType === type)
  }

  const formatDate = (dateString: string, dayOffset: number) => {
    const date = new Date(dateString)
    date.setDate(date.getDate() + dayOffset)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const totalCalories = mealPlan.meals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = mealPlan.meals.reduce((sum, meal) => sum + meal.protein, 0)
  const dailyAvgCalories = Math.round(totalCalories / 7)
  const dailyAvgProtein = Math.round(totalProtein / 7)

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{mealPlan.name}</h2>
            <p className="text-gray-600 mt-1">
              Week of {formatDate(mealPlan.weekStartDate, 0)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Daily Averages</div>
            <div className="text-lg font-semibold text-gray-900">
              {dailyAvgCalories} cal • {dailyAvgProtein}g protein
            </div>
            <div className="text-sm text-gray-500">
              Target: {mealPlan.caloriesTarget} cal • {mealPlan.proteinTarget}g protein
            </div>
          </div>
        </div>

        {mealPlan.preferences.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mealPlan.preferences.map((preference) => (
              <span
                key={preference}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
              >
                {preference}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {DAYS_OF_WEEK.map((day, index) => {
            const dayMeals = getMealsByDay(index)
            const lunch = getMealByType(dayMeals, 'LUNCH')
            const dinner = getMealByType(dayMeals, 'DINNER')
            const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0)
            const dayProtein = dayMeals.reduce((sum, meal) => sum + meal.protein, 0)

            return (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {day}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {formatDate(mealPlan.weekStartDate, index)}
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600">
                    {dayCalories} cal • {dayProtein}g protein
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Lunch */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">🍽️ Lunch</h4>
                    {lunch ? (
                      <MealCard meal={lunch} />
                    ) : (
                      <p className="text-gray-500 text-sm">No lunch planned</p>
                    )}
                  </div>

                  {/* Dinner */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">🍽️ Dinner</h4>
                    {dinner ? (
                      <MealCard meal={dinner} />
                    ) : (
                      <p className="text-gray-500 text-sm">No dinner planned</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <div>
      <h5 className="font-medium text-gray-900 mb-1">{meal.name}</h5>
      {meal.description && (
        <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
      )}
      
      <div className="text-xs text-gray-500 mb-2">
        {meal.calories} cal • {meal.protein}g protein
      </div>

      {meal.ingredients.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-gray-700 mb-1">Ingredients:</p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            {meal.ingredients.slice(0, 4).map((ingredient, index) => (
              <li key={index}>• {ingredient}</li>
            ))}
            {meal.ingredients.length > 4 && (
              <li className="text-gray-500">... and {meal.ingredients.length - 4} more</li>
            )}
          </ul>
        </div>
      )}

      {meal.instructions && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Instructions:</p>
          <p className="text-xs text-gray-600 line-clamp-3">{meal.instructions}</p>
        </div>
      )}
    </div>
  )
}
