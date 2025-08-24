-- DropIndex
DROP INDEX "public"."Verification_token_key";

-- AlterTable
ALTER TABLE "public"."Verification" ALTER COLUMN "token" DROP NOT NULL;
