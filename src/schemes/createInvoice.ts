import { z } from 'zod';
import {
  invoiceBankInfoSchema,
  invoiceBillingInfoSchema,
  invoiceCardDataSchema,
  invoiceCustomerSchema,
  invoiceEscrowPaymentSchema,
  invoiceUISchema,
  invoiceWebDataSchema,
  paymentInformationSchema,
} from './shared';

export const createInvoiceRequestSchema = paymentInformationSchema.extend({
  amount: z.number().positive().describe('Payment amount'),
  return_url: z
    .string()
    .describe('Url to redirect the customer after the payment'),
  details: z
    .object({
      customer: invoiceCustomerSchema.optional(),
      billing_info: invoiceBillingInfoSchema.optional(),
      bank: invoiceBankInfoSchema.optional(),
      card_data: invoiceCardDataSchema.optional(),
      web_data: invoiceWebDataSchema.optional(),
      ui: invoiceUISchema.optional(),
      escrow_payment: invoiceEscrowPaymentSchema.optional(),
    })
    .optional(),
});

export type CreateInvoiceRequestDto = z.infer<
  typeof createInvoiceRequestSchema
>;
