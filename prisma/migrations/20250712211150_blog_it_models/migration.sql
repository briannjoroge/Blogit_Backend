-- CreateTable
CREATE TABLE "user_table" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_table_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "post_table" (
    "post_id" TEXT NOT NULL,
    "featured_image_url" TEXT NOT NULL,
    "post_title" TEXT NOT NULL,
    "post_synopsis" TEXT NOT NULL,
    "post_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "post_table_pkey" PRIMARY KEY ("post_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_table_user_name_key" ON "user_table"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_table_email_key" ON "user_table"("email");

-- AddForeignKey
ALTER TABLE "post_table" ADD CONSTRAINT "post_table_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user_table"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
