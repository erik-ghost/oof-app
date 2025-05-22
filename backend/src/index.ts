import express from 'express';
import type { Request, Response } from 'express';
import { orderSchema } from './validation';
import type { OrderSubmission } from './types';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

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
    // Save order to file (no clean code, all in one function)
    const dir = path.join(process.cwd(), 'orders');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const fileName = path.join(dir, `${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify(order, null, 2));
    res.status(200).json({
      success: true,
      message: 'Order validated and saved successfully',
      order
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