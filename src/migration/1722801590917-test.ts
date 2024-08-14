import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1722801590917 implements MigrationInterface {
    name = 'Test1722801590917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "description" character varying, "deadline" TIMESTAMP, "member" character varying array, "flag" character varying, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "password" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_task_task" ("userId" uuid NOT NULL, "taskId" uuid NOT NULL, CONSTRAINT "PK_7e24789523e533650ba93c62327" PRIMARY KEY ("userId", "taskId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5ac2bbe1f56be9cc95d5e854d2" ON "user_task_task" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9cd03d35119207f6c1ae559ada" ON "user_task_task" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "user_task_task" ADD CONSTRAINT "FK_5ac2bbe1f56be9cc95d5e854d27" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_task_task" ADD CONSTRAINT "FK_9cd03d35119207f6c1ae559ada0" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_task_task" DROP CONSTRAINT "FK_9cd03d35119207f6c1ae559ada0"`);
        await queryRunner.query(`ALTER TABLE "user_task_task" DROP CONSTRAINT "FK_5ac2bbe1f56be9cc95d5e854d27"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cd03d35119207f6c1ae559ada"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ac2bbe1f56be9cc95d5e854d2"`);
        await queryRunner.query(`DROP TABLE "user_task_task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task"`);
    }

}
