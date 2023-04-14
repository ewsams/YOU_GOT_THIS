export interface Headers {
  normalizedNames: {};
  lazyUpdate: null;
}

export interface HttpErrorResponse {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: {
    message: string;
  };
}
