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

  const owned = and(
    eq(filesTable.id, id),
    eq(filesTable.userId, session.user.id),
  );

  try {
    const [row] = await db
      .select({ key: filesTable.key })
      .from(filesTable)
      .where(owned);
    if (!row) return { ok: true }; // already gone

    const res = await utapi.deleteFiles(row.key);
    if (!res.success)
      return { ok: false, error: "Couldn't delete from storage" };

    await db.delete(filesTable).where(owned);
  } catch {
    return { ok: false, error: "Something went wrong deleting the file" };
  }

  revalidatePath("/files");
  return { ok: true };
}
