interface GoalItem {
  label: string
  status: boolean
  completionTime: string
}

export interface YearlyGoals {
  year: string
  data: GoalItem[]
}
