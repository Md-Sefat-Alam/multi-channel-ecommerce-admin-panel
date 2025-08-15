export enum ORDER_STATUS {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export enum PAYMENT_METHOD {
  COD = "COD",
  CARD = "CARD",
  PAYPAL = "PAYPAL",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  ONLINE = "ONLINE",
}

export interface IOrderGet {
  id: number;
  uuid: string;
  invoiceNo: string;
  userId: string;
  orderStatus: ORDER_STATUS;
  addressId: string;
  remarks?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  activeStatus: number;
  user: {
    fullName: string;
    email?: string;
    mobileNumber: string;
    gender?: string;
  };
}

export interface IGetProps {
  start: number;
  length: number;
  search?: any;
  filters?: any;
}

export interface OrderItem {
  id: number;
  uuid: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  activeStatus: number;
  product: {
    id: number;
    uuid: string;
    title: string;
    category: {
      id: number;
      uuid: string;
      categoryName: string;
      categoryNameBn: string;
    };
  };
}

export interface Payment {
  id: number;
  uuid: string;
  orderId: string;
  userId: string;
  status: PAYMENT_STATUS;
  method: PAYMENT_METHOD;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  uuid: string;
  userId: string;
  divisionId: string;
  districtId: string;
  thanaId: string;
  postalCode?: string;
  addressLine?: string;
  createdAt: string;
  updatedAt: string;
  division: {
    nameEn: string;
    nameBn?: string;
  };
  district: {
    nameEn: string;
    nameBn?: string;
  };
  thana: {
    nameEn: string;
    nameBn?: string;
  };
}

export interface OrderDetails {
  id: number;
  uuid: string;
  invoiceNo: string;
  userId: string;
  orderStatus: ORDER_STATUS;
  addressId: string;
  remarks?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  activeStatus: number;
  items: OrderItem[];
  payments: Payment[];
  address: Address;
  user: {
    fullName: string;
    email?: string;
    mobileNumber: string;
    gender?: string;
  };
}
