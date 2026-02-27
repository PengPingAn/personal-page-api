interface TraitData {
  label: string
  value: number
  tooltip?: string
  animatedWidth?: number
  displayedValue?: number
}

export interface MBTICharacter {
  mbti: string
  name: string
  description: string
  imgUrl?: string
  data: TraitData[]
}
