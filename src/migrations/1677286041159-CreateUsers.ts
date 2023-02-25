import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateUsers1677286041159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'encrypted_password',
            type: 'text'
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
          },
          {
            name: 'confirmation_token',
            type: 'text',
            isNullable: true
          },
          {
            name: 'confirmation_token_sent_at',
            type: 'timestamptz',
            isNullable: true
          },
          {
            name: 'confirmation_at',
            type: 'timestamptz',
            isNullable: true
          },
          {
            name: 'reset_password_token',
            type: 'text',
            isNullable: true
          },
          {
            name: 'reset_password_token_sent_at',
            type: 'timestamptz',
            isNullable: true
          }
        ]
      })
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'users_email_index',
        isUnique: true,
        columnNames: ['email']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'users_email_index');

    await queryRunner.dropTable('users');
  }
}
