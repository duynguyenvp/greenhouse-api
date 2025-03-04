import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSensorModel1741064393998 implements MigrationInterface {
    name = 'AddSensorModel1741064393998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "command" character varying NOT NULL, "type" character varying NOT NULL, "location" character varying, "unit" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "search_vector" tsvector NOT NULL, CONSTRAINT "UQ_7eb3fedbf9f44c0ed8df642d3bf" UNIQUE ("command"), CONSTRAINT "PK_ccc38b9aa8b3e198b6503d5eee9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "sensor_search_vector_idx" ON "sensor" ("search_vector") `);
        await queryRunner.query(`CREATE TABLE "sensor_data" ("id" SERIAL NOT NULL, "sensorId" integer NOT NULL, "value" double precision NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c0b5610a1a0f690d40239d408d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sensor_data" ADD CONSTRAINT "FK_7644419e32b5c253d2bb101f086" FOREIGN KEY ("sensorId") REFERENCES "sensor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor_data" DROP CONSTRAINT "FK_7644419e32b5c253d2bb101f086"`);
        await queryRunner.query(`DROP TABLE "sensor_data"`);
        await queryRunner.query(`DROP INDEX "public"."sensor_search_vector_idx"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
    }

}
