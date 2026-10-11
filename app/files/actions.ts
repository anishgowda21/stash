"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { db } from "@/utils/database";
import { filesTable } from "@/db/file-schema";
import { getSession } from "@/utils/session";

const utapi = new UTApi();

export async function deleteFile(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // userId in the query is the ownership check: you can only delete your own rows
  const owned = and(
    eq(filesTable.id, id),
    eq(filesTable.userId, session.user.id),
  );

  const [row] = await db
    .select({ key: filesTable.key })
    .from(filesTable)
    .where(owned);
  if (!row) return;

  const res = await utapi.deleteFiles(row.key);
  if (!res.success) throw new Error("Could not delete the file from storage");

  await db.delete(filesTable).where(owned);
  revalidatePath("/files");
}
