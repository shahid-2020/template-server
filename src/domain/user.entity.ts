import { Entity, Column } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Role, Status } from '../shared/constant/enums/user.enum'
import { Base } from './base.entity'

@Entity('user')
export class User extends Base {
  @Column()
  name: string

  @Column({ unique: true })
  username: string

  @Column()
  countryCode: string

  @Column({ unique: true })
  phoneNumber: string

  @Column({ type: 'boolean', default: false })
  isPhoneNumberVerified: boolean

  @Column({
    unique: true,
  })
  email: string

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean

  @Exclude()
  @Column()
  password: string

  @Exclude()
  @Column({ type: 'enum', enum: Status, default: Status.Active })
  status: Status

  @Column({ type: 'simple-array', default: () => `('${Role.User}')` })
  roles: Role[]
}
