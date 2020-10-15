import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createImages1602754209772 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'images',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true, // Não pode ser negativo
          isPrimary: true, // Indicará que é a primaryKey
          isGenerated: true, // Será gerada automaticamente
          generationStrategy: 'increment', // Será gerada utilizando uma lógica incremental
        },
        {
          name: 'path',
          type: 'varchar',
        },
        {
          name: 'orphanage_id',
          type: 'integer',
        },
      ],
      foreignKeys: [
        {
          name: 'ImageOrphanage',
          columnNames: ['orphanage_id'],
          referencedTableName: 'orphanages',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE', // Se o id de orfanato for mudado, então é mudado aqui também
          onDelete: 'CASCADE', // Caso o orfanato seja deletado, então as imagens também serão
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images');
  }
}
