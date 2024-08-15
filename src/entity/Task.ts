import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { flag } from "../type";
import { User } from "./User";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ nullable: true })
  flag: flag;

  @ManyToMany(() => User, (user) => user.task)
  user: User[];
}
