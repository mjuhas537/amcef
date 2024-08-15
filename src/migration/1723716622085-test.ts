import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1723716622085 implements MigrationInterface {
    name = 'Test1723716622085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "member" TO "author"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "author" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "author"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "author" character varying array`);
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "author" TO "member"`);
    }

}
