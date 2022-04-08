export interface IRead<T> {
  find(item: T, relations?: string[]): Promise<T[]>
  findById(id: string, relations?: string[]): Promise<T | null>
  findOne(item: T, relations?: string[]): Promise<T | null>
}
