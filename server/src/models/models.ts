import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, Index } from "typeorm";

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

  @CreateDateColumn()
  @Index()
  createdAt!: Date;
}