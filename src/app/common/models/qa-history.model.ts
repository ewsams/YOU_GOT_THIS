export interface QaHistory {
  _id?: string
  userId: string
  qa: Array<{ query: string; answer: string }>
  embeddingsUrl: string
  mediaType: 'pdf' | 'audio'
  title: string
  created_at?: Date
  updated_at?: Date
}
