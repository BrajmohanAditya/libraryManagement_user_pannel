import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  razorpayKeyId!: string;

  @Column({ nullable: true })
  razorpayKeySecret!: string;

  @Column({ default: true })
  smsNotificationEnabled!: boolean;

  @Column({nullable : true})
  libraryId! :string
}