import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { FileBatch } from './file-batch.entity';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  caseNumber: string;

  @Column()
  clientName: string;

  @Column()
  attorney: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  court: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'date', nullable: true })
  openingDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @OneToMany(() => FileBatch, (batch) => batch.case, { cascade: true })
  batches: FileBatch[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}