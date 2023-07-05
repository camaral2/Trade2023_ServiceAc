import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';

@Entity('historico')
export class historico extends BaseEntity {
  @ObjectIdColumn({ primary: true })
  _id: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: false })
  acao: string;

  @Column()
  descricao: string;

  @Column()
  sentiment: number;

  @Column()
  created_at: Date;

  @Column()
  dtbrasil: Date;

  constructor(obj?: Partial<historico>) {
    super();
    Object.assign(this, obj);
  }
}
