import { FindManyOptions, FindOneOptions } from 'typeorm'

export interface IRead<T> {
  find(options: FindManyOptions): Promise<T[]>
  findById(id: string, relations?: string[]): Promise<T | null>
  findOne(options: FindOneOptions): Promise<T | null>
}
