export interface QaHistory {
  _id?: string
  userId: string
  chatId: string
  qa: Array<{ query: string; answer: string }>
  embeddingsUrl: string
}
