import { MigrationInterface, QueryRunner } from "typeorm";

export class Device1740997074286 implements MigrationInterface {
  name = "Device1740997074286";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS pg_trgm");
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS unaccent");

    await queryRunner.query(
      `CREATE TABLE "device_scheduler" ("id" SERIAL NOT NULL, "deviceId" integer NOT NULL, "scheduler" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_67e80de06b6237808d1601d9eaa" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "device" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'switch', "status" character varying NOT NULL DEFAULT 'stopped', "search_vector" tsvector NOT NULL, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "device_search_vector_idx" ON "device" ("search_vector") `
    );

    // Thêm cột search_vector với giá trị mặc định tạm thời
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "search_vector" tsvector DEFAULT ''::tsvector
  `);

    // Cập nhật dữ liệu cũ
    await queryRunner.query(`
      UPDATE "user"
      SET search_vector = to_tsvector('simple', unaccent(name))
      WHERE search_vector IS NULL
  `);

    // Bỏ giá trị mặc định của cột search_vector
    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN "search_vector" DROP DEFAULT
  `);

    await queryRunner.query(
      `CREATE INDEX "user_search_vector_idx" ON "user" USING GIN("search_vector")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP EXTENSION IF EXISTS pg_trgm");
    await queryRunner.query("DROP EXTENSION IF EXISTS unaccent");

    await queryRunner.query(`DROP INDEX "public"."user_search_vector_idx"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "search_vector"`);
    await queryRunner.query(`DROP INDEX "public"."device_search_vector_idx"`);
    await queryRunner.query(`DROP TABLE "device"`);
    await queryRunner.query(`DROP TABLE "device_scheduler"`);
  }
}
