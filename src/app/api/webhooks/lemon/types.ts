
export interface CreateCheckoutPayload {
  productId: number;
  email?: string;
  returnUrl?: string;
  variantId?: number;
}

