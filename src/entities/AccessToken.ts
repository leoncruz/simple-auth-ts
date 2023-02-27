import { isAfter } from 'date-fns';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectLiteral,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity('access_tokens')
export class AccessToken {
  constructor(accessToken: Partial<object | ObjectLiteral | null>) {
    Object.assign(this, accessToken);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'expires_in' })
  expiresIn: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accessTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  get isValid(): boolean {
    return isAfter(this.expiresIn, new Date());
  }
}
