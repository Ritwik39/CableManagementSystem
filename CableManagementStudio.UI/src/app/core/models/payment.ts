export interface Payment {
  paymentId: number;

  customerId: number;

  customer?: {
    customerId: number;
    name: string;
    connectionNumber: string;
  };

  amount: number;

  paymentDate: string;

  paymentMode: string;

  status: string;

  remarks?: string;
}
