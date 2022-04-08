import {
  EntityTarget,
  FindOneOptions,
  getRepository,
  Repository,
} from 'typeorm'
import { IWrite } from '../interface/IWrite.interface'
import { IRead } from '../interface/IRead.interface'

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public readonly repository: Repository<T>
  constructor(entity: EntityTarget<T>) {
    this.repository = getRepository(entity)
  }

  async find(options: FindOneOptions<T>): Promise<T[]> {
    const found = await this.repository.find(options)
    return found
  }

  async findOne(
    options: FindOneOptions<T>,
  ): Promise<T | null> {
    const found = await this.repository.findOne(options)
    if (!found) {
      return null
    }
    return found
  }

  async findById(id: string, relations?: string[]): Promise<T | null> {
    const found = await this.repository.findOne(id, { relations })
    if (!found) {
      return null
    }
    return found
  }

  async create(item: any): Promise<T> {
    const created = await this.repository.insert(item)
    const { id } = created.identifiers[0]
    const obj = await this.repository.findOne(id)
    return obj as T
  }

  async update(id: string, item: any): Promise<T | null> {
    const updated = await this.repository.update(id, item)
    if(updated.affected !== 1){
      return null
    }
    const obj = await this.repository.findOne(id)
    return obj as T
  }

  async delete(id: string): Promise<T | null> {
    const found = await this.repository.findOne(id)
    if (!found) {
      return null
    }
    await this.repository.delete(id)
    return found
  }
}
