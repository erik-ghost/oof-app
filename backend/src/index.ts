import express from 'express';
import type { Request, Response } from 'express';
import { orderSchema } from './validation';
import type { OrderSubmission } from './types';

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
    
    // For now, just acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Order validated successfully',
      order
    });
  } catch (error) {
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