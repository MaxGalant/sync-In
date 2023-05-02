import { MigrationInterface, QueryRunner } from "typeorm";

export class first1683062139594 implements MigrationInterface {
    name = 'first1683062139594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."friend_status_enum" AS ENUM('pending', 'accepted', 'blocked', 'declined')`);
        await queryRunner.query(`CREATE TABLE "friend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "friendId" character varying NOT NULL, "status" "public"."friend_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying, CONSTRAINT "PK_1b301ac8ac5fcee876db96069b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "first_name" character varying NOT NULL, "second_name" character varying NOT NULL, "image_url" character varying, "nickname" character varying, "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_user_status_enum" AS ENUM('pending', 'accepted', 'denied')`);
        await queryRunner.query(`CREATE TABLE "group_user" ("id" SERIAL NOT NULL, "status" "public"."group_user_status_enum" NOT NULL DEFAULT 'pending', "userId" character varying, "groupId" uuid, CONSTRAINT "PK_c637f43a6f0d7891fec59f4d7a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownerId" character varying NOT NULL, "imageUrl" character varying, "name" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."week_status_enum" AS ENUM('pending', 'in progress', 'finished')`);
        await queryRunner.query(`CREATE TABLE "week" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."week_status_enum" NOT NULL DEFAULT 'pending', "started_at" TIMESTAMP NOT NULL DEFAULT now(), "finished_at" TIMESTAMP NOT NULL DEFAULT now(), "groupId" uuid, CONSTRAINT "PK_1f85dfadd5f363a1d0bce2b9664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "is_finished" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "weekId" uuid, "dayId" uuid, CONSTRAINT "REL_854378a588e5ac161c3fed99ad" UNIQUE ("dayId"), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT false, "started_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "day" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_finished" boolean NOT NULL DEFAULT false, "number" integer NOT NULL, "started_at" TIMESTAMP NOT NULL DEFAULT now(), "finished_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "eventId" uuid, "weekId" uuid, CONSTRAINT "REL_2337d487b5d09abe39fa504a48" UNIQUE ("eventId"), CONSTRAINT "PK_42e726f6b72349f70b25598b50e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friend" ADD CONSTRAINT "FK_855044ea856e46f62a46acebd65" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_user" ADD CONSTRAINT "FK_c668a68c15f16d05c2a0102a51d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_user" ADD CONSTRAINT "FK_79924246e997ad08c58819ac21d" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "week" ADD CONSTRAINT "FK_53843a24aeecfd2e70366dcb8d3" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_db8de253cff99769c71c09d75eb" FOREIGN KEY ("weekId") REFERENCES "week"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_854378a588e5ac161c3fed99ad0" FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day" ADD CONSTRAINT "FK_2337d487b5d09abe39fa504a485" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "day" ADD CONSTRAINT "FK_2728c59e4ee0663747838c13021" FOREIGN KEY ("weekId") REFERENCES "week"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "day" DROP CONSTRAINT "FK_2728c59e4ee0663747838c13021"`);
        await queryRunner.query(`ALTER TABLE "day" DROP CONSTRAINT "FK_2337d487b5d09abe39fa504a485"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_854378a588e5ac161c3fed99ad0"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_db8de253cff99769c71c09d75eb"`);
        await queryRunner.query(`ALTER TABLE "week" DROP CONSTRAINT "FK_53843a24aeecfd2e70366dcb8d3"`);
        await queryRunner.query(`ALTER TABLE "group_user" DROP CONSTRAINT "FK_79924246e997ad08c58819ac21d"`);
        await queryRunner.query(`ALTER TABLE "group_user" DROP CONSTRAINT "FK_c668a68c15f16d05c2a0102a51d"`);
        await queryRunner.query(`ALTER TABLE "friend" DROP CONSTRAINT "FK_855044ea856e46f62a46acebd65"`);
        await queryRunner.query(`DROP TABLE "day"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "week"`);
        await queryRunner.query(`DROP TYPE "public"."week_status_enum"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "group_user"`);
        await queryRunner.query(`DROP TYPE "public"."group_user_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "friend"`);
        await queryRunner.query(`DROP TYPE "public"."friend_status_enum"`);
    }

}
