import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";
import { connection } from "next/server";

export const getSession = cache(async () => {
  await connection();
  return auth.api.getSession({ headers: await headers() });
});
