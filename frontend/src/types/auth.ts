import { z } from 'zod';

export const RegisterUserSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character. Special characters include @ $ ! % * ? &'
      ),
    confirmPassword: z.string().min(8),
    username: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;

export const LoginResponseSchema = z.object({
  id: z.number(),
  token: z.string(),
  expiresIn: z.number(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const VerifyUserSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().min(6).max(6),
});

export type VerifyUser = z.infer<typeof VerifyUserSchema>;

export const VerifyUserCodeSchema = VerifyUserSchema.pick({
  verificationCode: true,
});
export type VerifyUserCode = z.infer<typeof VerifyUserCodeSchema>;

/**
 * Keys for auth related data in local storage
 */
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  EXPIRES_IN: 'expiresIn',
} as const;
