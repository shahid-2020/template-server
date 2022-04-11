export interface IWrite<T> {
  create(fields: T): Promise<T>
  update(id: string, fields: T): Promise<T | null>
  delete(id: string): Promise<T | null>
}
