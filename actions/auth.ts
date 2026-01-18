"use server";

import { hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { AuthCredentials } from "@/types";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error) {
    console.log("SignIn Error: ", error);
    return {
      success: false,
      error: "Please check your credentials and try again.",
    };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { name, email, password } = params;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim()))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "User already exists",
    };
  }
  const hashedPassword = hashSync(password, 10);
  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
    await signInWithCredentials({ email, password });
    return { success: true };
  } catch (error) {
    console.log("SignUp Error: ", error);
    return { success: false, error: "Failed to create an account." };
  }
};
