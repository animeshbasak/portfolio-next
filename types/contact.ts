export interface ContactFormData {
  name: string
  email: string
  message: string
  opportunityType: string
}

export interface ContactFormState {
  status: 'idle' | 'loading' | 'success' | 'error'
  errors: Partial<Record<keyof ContactFormData, string>>
}
