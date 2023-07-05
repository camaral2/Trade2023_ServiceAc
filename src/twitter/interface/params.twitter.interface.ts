export interface paramsTwitterInterface {
  query: string;
  'tweet.fields': string;
  max_results: number;
  start_time?: string;
  next_token?: string;
}
