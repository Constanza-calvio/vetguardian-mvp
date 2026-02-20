"use server";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(role: string) {
  const { userId } = await auth();
  if (!userId) return;

  const client = await clerkClient();

  // Guardamos el rol en el metadata de Clerk permanentemente
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: role,
    },
  });

  revalidatePath("/dashboard");
}