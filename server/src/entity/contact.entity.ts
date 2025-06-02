import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, Index } from "typeorm";
import { Tag } from "./tag.entity";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phoneNumber!: string;

  @ManyToMany(() => Tag, (tag) => tag.contacts, { eager: true })
  @JoinTable()
  tags!: Tag[];

  //We will use it as sorting property later so we index it in order to make the sorting faster
  @CreateDateColumn()
  @Index()
  createdAt!: Date;
}