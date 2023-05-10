import { MigrationInterface, QueryRunner } from 'typeorm';

export class firsts1683755948361 implements MigrationInterface {
  name = 'firsts1683755948361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "day" DROP CONSTRAINT "FK_2337d487b5d09abe39fa504a485"`,
    );
    await queryRunner.query(
      `ALTER TABLE "day" DROP CONSTRAINT "REL_2337d487b5d09abe39fa504a48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "day" ADD CONSTRAINT "FK_2337d487b5d09abe39fa504a485" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "day" DROP CONSTRAINT "FK_2337d487b5d09abe39fa504a485"`,
    );
    await queryRunner.query(
      `ALTER TABLE "day" ADD CONSTRAINT "REL_2337d487b5d09abe39fa504a48" UNIQUE ("eventId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "day" ADD CONSTRAINT "FK_2337d487b5d09abe39fa504a485" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
