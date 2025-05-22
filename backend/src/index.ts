import express from 'express';
import type { Request, Response } from 'express';
import { orderSchema } from './validation';
import type { OrderSubmission } from './types';
import fs from 'fs';
import path from 'path';

function getSetPrice(setId: string): number {
  // Example: hardcoded prices for demonstration
  if (setId === '10297') return 150;
  if (setId === '12345') return 200;
  return 100; // default price
}

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/v1/submit-order', async (req: Request, res: Response) => {
  try {
    const result = orderSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    const order = result.data as OrderSubmission;
    let salesTax = 0;
    if (order.address.state.toUpperCase() === 'CO' || order.address.state.toUpperCase() === 'COLORADO') {
      const pricePerSet = getSetPrice(order.setId);
      const subtotal = pricePerSet * order.quantity;
      salesTax = +(subtotal * 0.029).toFixed(2);
    }
    const orderToSave = { ...order, salesTax };
    const dir = path.join(process.cwd(), 'orders');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const fileName = path.join(dir, `${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify(orderToSave, null, 2));
    res.status(200).json({
      success: true,
      message: 'Order validated and saved successfully',
      order: orderToSave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 