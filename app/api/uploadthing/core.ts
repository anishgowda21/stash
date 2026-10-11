import { filesTable } from "@/db/file-schema";
import { auth } from "@/utils/auth";
import { db } from "@/utils/database";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const authUser = async (_req: Request) => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user;
};

export const ourFileRouter = {
  fileUploader: f({
    blob: {
      maxFileCount: 10,
      maxFileSize: "1GB",
    },
  })
    .middleware(async ({ req }) => {
      const user = await authUser(req);

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(filesTable).values({
        userId: metadata.userId,
        key: file.key,
        hash: file.fileHash,
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.ufsUrl,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
