import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn,
} from 'typeorm';
import Image from './Image';

@Entity('orphanages')
export default class Orphanage {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column()
  latitude: number

  @Column()
  longitude: number

  @Column()
  about: string

  @Column()
  instructions: string

  @Column()
  opening_hours: string

  @Column()
  open_on_weekends: boolean

  // Como não existe no banco de dados, eu não coloco o @Column()
  @OneToMany(() => Image, (image) => image.orphanage, {
    cascade: ['insert', 'update'], // Quando cadastrar/atualizar um orfanato, ele vai automaticamete cadastrar/atualizar as imagens
  })
  @JoinColumn({ name: 'orphanage_id' }) // O nome da coluna na entidade Images que relaciona com Orphanage
  images: Image[]
}
