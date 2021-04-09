export interface Style {
  [key: string]: string | number | null | undefined
}

export interface Option {
  text?: string | null
  value?: string | number | null
}

export interface Filter {
  dataKey: string
  label?: string
  options: Option[]
  defaultValue?: string
  dropdownMatchSelectWidth?: boolean
  onFilterChange?: (value: string) => void
  disabled?: boolean
}

export interface FilterValue {
  dataKey: string
  value: string
}

export interface DateValue {
  dataKey: string
  value: [string, string]
}
