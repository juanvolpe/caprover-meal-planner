'use client'

import { useState } from 'react'
import { MealPlan, MealPlanRequest } from '../types/meal-plan'

interface MealPlanFormProps {
  onMealPlanGenerated: (mealPlan: MealPlan) => void
  onGenerateStart: () => void
  isGenerating: boolean
}

export default function MealPlanForm({ 
  onMealPlanGenerated, 
  onGenerateStart, 
  isGenerating 
}: MealPlanFormProps) {
  const [formData, setFormData] = useState<MealPlanRequest>({
    name: '',
    email: '',
    caloriesTarget: 2000,
    proteinTarget: 150,
    preferences: [],
    weekStartDate: new Date().toISOString().split('T')[0]
  })

  const [customPreference, setCustomPreference] = useState('')

  const commonPreferences = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Low-carb',
    'High-protein',
    'Mediterranean',
    'No nuts',
    'No seafood'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }))
  }

  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }))
  }

  const handleAddCustomPreference = () => {
    if (customPreference.trim() && !formData.preferences.includes(customPreference.trim())) {
      setFormData(prev => ({
        ...prev,
        preferences: [...prev.preferences, customPreference.trim()]
      }))
      setCustomPreference('')
    }
  }

  const handleRemovePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.filter(p => p !== preference)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onGenerateStart()

    try {
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate meal plan')
      }

      const mealPlan = await response.json()
      onMealPlanGenerated(mealPlan)
    } catch (error) {
      console.error('Error generating meal plan:', error)
      alert('Failed to generate meal plan. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="caloriesTarget" className="block text-sm font-medium text-gray-700 mb-2">
            Daily Calories Target
          </label>
          <input
            type="number"
            id="caloriesTarget"
            name="caloriesTarget"
            value={formData.caloriesTarget}
            onChange={handleInputChange}
            required
            min="1200"
            max="4000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="proteinTarget" className="block text-sm font-medium text-gray-700 mb-2">
            Daily Protein Target (g)
          </label>
          <input
            type="number"
            id="proteinTarget"
            name="proteinTarget"
            value={formData.proteinTarget}
            onChange={handleInputChange}
            required
            min="50"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="weekStartDate" className="block text-sm font-medium text-gray-700 mb-2">
            Week Start Date
          </label>
          <input
            type="date"
            id="weekStartDate"
            name="weekStartDate"
            value={formData.weekStartDate}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dietary Preferences & Restrictions
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {commonPreferences.map((preference) => (
            <button
              key={preference}
              type="button"
              onClick={() => handlePreferenceToggle(preference)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                formData.preferences.includes(preference)
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {preference}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customPreference}
            onChange={(e) => setCustomPreference(e.target.value)}
            placeholder="Add custom preference..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomPreference())}
          />
          <button
            type="button"
            onClick={handleAddCustomPreference}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>

        {formData.preferences.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Selected preferences:</p>
            <div className="flex flex-wrap gap-2">
              {formData.preferences.map((preference) => (
                <span
                  key={preference}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {preference}
                  <button
                    type="button"
                    onClick={() => handleRemovePreference(preference)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Meal Plan'}
      </button>
    </form>
  )
}
