import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';

@Entity('processo')
export class processo extends BaseEntity {
  @ObjectIdColumn({ primary: true })
  _id: string;

  @Column({ nullable: false })
  sessao: string;

  @Column({ nullable: false })
  acao: string;

  @Column({ nullable: false })
  key: number;

  @Column()
  descricao: string;

  @Column()
  status: number;

  @Column()
  dtInicio?: Date;

  @Column()
  dtFim?: Date;

  @Column()
  error?: string;

  constructor(obj?: Partial<processo>) {
    super();
    Object.assign(this, obj);
  }
}
