/*
  Warnings:

  - The primary key for the `post_curtidas` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "post_curtidas" DROP CONSTRAINT "post_curtidas_pkey",
ADD CONSTRAINT "post_curtidas_pkey" PRIMARY KEY ("post_id", "user_id");
