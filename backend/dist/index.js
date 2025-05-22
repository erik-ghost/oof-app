"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("./validation");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.post('/api/v1/submit-order', async (req, res) => {
    try {
        const result = validation_1.orderSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        const order = result.data;
        // For now, just acknowledge receipt
        res.status(200).json({
            success: true,
            message: 'Order validated successfully',
            order
        });
    }
    catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
