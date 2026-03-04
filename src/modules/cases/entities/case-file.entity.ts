import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FileBatch } from './file-batch.entity';

@Entity('case_files')
export class CaseFile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalName: string;

    @Column()
    storedName: string;

    @Column()
    relativePath: string;

    @Column()
    mimetype: string;

    @Column({ type: 'bigint' })
    size: number;

    @ManyToOne(() => FileBatch, (b) => b.files, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'batch_id' })
    batch: FileBatch;

    @CreateDateColumn()
    createdAt: Date;
}