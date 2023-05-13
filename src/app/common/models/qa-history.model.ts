export interface QaHistory {
  _id?: string
  userId: string
  qa: Array<{ query: string; answer: string }>
  embeddingsUrl: string
  mediaType: 'pdf' | 'audio'
}
