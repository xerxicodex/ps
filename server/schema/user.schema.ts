import { object, string, number, TypeOf } from 'zod';

export const createUserSchema = object({
    username: string().min(1, 'Username is required').max(100),
    password: string()
      .min(1, 'Password is required')
      .min(7, 'Password must 8 or more characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string().min(1, 'Please confirm your password'),
    starter:  number().min(1, "Please select a starter").max(3, "Invalid starter"),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  });

export const loginUserSchema = object({
  username: string({ required_error: 'Username is required' }),
  password: string({ required_error: 'Password is required' })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
