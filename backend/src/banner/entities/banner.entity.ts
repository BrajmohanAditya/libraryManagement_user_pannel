import { Library } from "src/librarys/entities/library.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";


@Entity("banners")
export class Banner {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  libraryId!: string;

  

  @Column()
  image!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}