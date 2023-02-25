import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectLiteral,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import bcrypt from 'bcrypt';

@Entity('users')
export class User {
  constructor(user: Partial<object | ObjectLiteral | null>) {
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'encrypted_password' })
  private encryptedPassword: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'confirmation_token' })
  confirmationToken: string;

  @Column({ name: 'confirmation_token_sent_at' })
  confirmationTokenSentAt: Date;

  @Column({ name: 'confirmation_at' })
  confirmationAt: Date;

  @Column({ name: 'reset_password_token' })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_token_sent_at' })
  resetPasswordTokenSentAt: Date;

  set password(password: string) {
    this.encryptedPassword = bcrypt.hashSync(password, 10);
  }

  get password() {
    return this.encryptedPassword;
  }

  passwordIsValid(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  get confirmedAccount(): boolean {
    return this.confirmationAt !== null;
  }
}
