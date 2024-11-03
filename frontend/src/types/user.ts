import * as z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean()
});

export const UsersArraySchema = z.array(UserSchema);

export type User = z.infer<typeof UserSchema>;

export const UserUpdateDataSchema = z.object({
  id: z.string(),
  isAdmin: z.boolean(),
  name: z.string(),
  role: z.string()
});

export type UserUpdateData = z.infer<typeof UserUpdateDataSchema>;
