import { z } from 'zod';

export const orderSchema = z.object({
  setId: z.string().min(1, 'Set ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive number'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().length(2, 'State must be a 2-letter code'),
    zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits')
  })
}); 