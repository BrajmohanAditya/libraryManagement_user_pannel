import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  import { User } from 'src/users/entities/user.entity';
  import { Library } from 'src/librarys/entities/library.entity';
  
  
  @Entity('feedback')
  export class Feedback {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @ManyToOne(() => User, {
      nullable: true,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user!: User;
  
    @ManyToOne(() => Library, {
      nullable: true,
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'libraryId' })
    library!: Library;
  
    @Column()
    rating!: number;
  
    @Column({ type: 'text' })
    message!: string;
  
    @CreateDateColumn()
    createdAt!: Date;
  }