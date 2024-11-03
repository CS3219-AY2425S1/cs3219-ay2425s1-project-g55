import * as z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean()
});

export const UsersArraySchema = z.array(UserSchema);

export type User = z.infer<typeof UserSchema>;

export const UserRoleUpdateDataSchema = z.object({
  id: z.string(),
  role: z.enum(["admin", "user"])
});

export type UserRoleUpdateData = z.infer<typeof UserRoleUpdateDataSchema>;
