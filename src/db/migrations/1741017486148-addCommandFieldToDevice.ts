import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommandFieldToDevice1741017486148 implements MigrationInterface {
    name = 'AddCommandFieldToDevice1741017486148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "command" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "UQ_309c3ec964b8de8b386879dd0dc" UNIQUE ("command")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "search_vector" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "search_vector" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "UQ_309c3ec964b8de8b386879dd0dc"`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "command"`);
    }

}
