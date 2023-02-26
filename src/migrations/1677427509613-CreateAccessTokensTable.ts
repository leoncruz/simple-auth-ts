import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class CreateAccessTokensTable1677427509613
  implements MigrationInterface
{
  name = 'CreateAccessTokensTable1677427509613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'access_tokens',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false
          },
          {
            name: 'code',
            type: 'text',
            isUnique: true,
            isNullable: false
          },
          {
            name: 'expires_in',
            type: 'timestamptz',
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()'
          },

          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'access_tokens',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('access_tokens');
  }
}
