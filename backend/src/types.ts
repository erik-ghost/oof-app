export interface OrderSubmission {
  // Core order details
  setId: string;
  quantity: number;
  
  // Customer information
  name: string;
  email: string;
  
  // Shipping address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
} 