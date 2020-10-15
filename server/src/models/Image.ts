/* eslint-disable max-len */
import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import Orphanage from './Orphanage';

@Entity('images')
export default class Image {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  path: string

  @ManyToOne(() => Orphanage, (orphanage) => orphanage.images) // O campo em Orphanages que contém as imagens
  @JoinColumn({ name: 'orphanage_id' })
  orphanage: Orphanage
}
