"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const zod_1 = require("zod");
exports.orderSchema = zod_1.z.object({
    setId: zod_1.z.string().min(1, 'Set ID is required'),
    quantity: zod_1.z.number().int().positive('Quantity must be a positive number'),
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    address: zod_1.z.object({
        street: zod_1.z.string().min(1, 'Street address is required'),
        city: zod_1.z.string().min(1, 'City is required'),
        state: zod_1.z.string().length(2, 'State must be a 2-letter code'),
        zipCode: zod_1.z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits')
    })
});
