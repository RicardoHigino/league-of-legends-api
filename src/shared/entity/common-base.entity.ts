import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class CommonBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uid: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;
}
