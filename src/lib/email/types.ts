/**
 * Sreesha Elegance — Transactional Email Types & Contracts
 */

export interface OrderItemPayload {
  title: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
  category?: string;
}

export interface ShippingAddressPayload {
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderEmailPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  items: OrderItemPayload[];
  shippingAddress: ShippingAddressPayload;
  trackingNumber?: string;
  paymentMethod?: string;
}

export interface PaymentReceiptPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  paymentId: string;
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  amount: number;
  paymentDate?: string;
  upiVpa?: string;
}

export interface ShippingNotificationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  items: OrderItemPayload[];
  shippingAddress: ShippingAddressPayload;
}

export interface DeliveryNotificationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  deliveredDate: string;
  carrier: string;
  trackingNumber: string;
  items: OrderItemPayload[];
}

export interface CancellationNotificationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  reason?: string;
  refundAmount?: number;
  refundReference?: string;
}

export interface WelcomeEmailPayload {
  customerName: string;
  customerEmail: string;
  phone?: string;
}

export interface AdminOrderAlertPayload {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  total: number;
  paymentMethod: string;
  items: OrderItemPayload[];
  shippingAddress: ShippingAddressPayload;
}

export interface AppointmentEmailPayload {
  appointmentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  serviceLabel: string;
  date: string;
  timeSlot: string;
  mode: "in_store" | "virtual_video";
  city?: string;
  occasionDate?: string;
  notes?: string;
  calendarLink?: string;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
  duplicate?: boolean;
}
