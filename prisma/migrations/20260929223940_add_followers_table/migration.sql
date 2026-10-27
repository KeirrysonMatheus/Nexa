-- CreateTable
CREATE TABLE "seguidores" (
    "seguidor_id" UUID NOT NULL,
    "seguido_id" UUID NOT NULL,

    CONSTRAINT "seguidores_pkey" PRIMARY KEY ("seguidor_id","seguido_id")
);

-- CreateIndex
CREATE INDEX "seguidores_seguido_id_idx" ON "seguidores"("seguido_id");

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_seguidor_id_fkey" FOREIGN KEY ("seguidor_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_seguido_id_fkey" FOREIGN KEY ("seguido_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
