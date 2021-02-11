import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { hash } from "bcrypt";
import { IsEmail, Length } from "class-validator";
import { classToPlain, Exclude } from "class-transformer";

@Entity("users")
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @Index()
  @Length(3, 255)
  username: string;

  @Column()
  @Length(6, 255)
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    try {
      this.password = await hash(this.password, 10);
    } catch (ex) {
      console.log("Exception:", ex.mesage);
    }
  }
  toJSON() {
    return classToPlain(this);
  }
}
