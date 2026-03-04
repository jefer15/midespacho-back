import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Case } from './case.entity';
import { CaseFile } from './case-file.entity';

@Entity('file_batches')
export class FileBatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    folderPath: string;

    @ManyToOne(() => Case, (c) => c.batches, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'case_id' })
    case: Case;

    @OneToMany(() => CaseFile, (f) => f.batch, { cascade: true })
    files: CaseFile[];

    @CreateDateColumn()
    createdAt: Date;
}