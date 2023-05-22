export interface QA {
  query: string
  answer: string
  _id?: string
  created_at?: string
  updated_at?: string
}

export interface UpdateQAHistory {
  _id?: string
  userId: string
  title: string
  qa: QA[]
  embeddingsUrl: string
  mediaType: string
  created_at?: string
  updated_at?: string
  __v?: number
}

export interface UserQaHistoriesResponse {
  totalCount: number
  totalPages: number
  currentPage: number
  qaHistories: UpdateQAHistory[]
}
