export interface Customer {
  customerId: number;
  userId: number;
  packageId: number;

  name: string;
  mobile: string;
  address: string;

  connectionNumber: string;

  isActive: boolean;
}
