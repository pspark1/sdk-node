import { z } from 'zod';
import {
  invoiceBankInfoSchema,
  invoiceBillingInfoSchema,
  invoiceCardDataSchema,
  invoiceCustomerSchema,
  invoiceWebDataSchema,
} from './shared';

export const createWithdrawalRequestSchema = z.object({
  reference: z.string().describe('Your internal transaction ID'),
  amount: z.number().positive().describe('Payment amount'),
  account: z.string().describe('Withdrawall address/card'),
  details: z
    .object({
      crypto: z
        .object({
          memo: z.string().optional(),
        })
        .optional(),
      customer: invoiceCustomerSchema.optional(),
      billing_info: invoiceBillingInfoSchema.optional(),
      bank: invoiceBankInfoSchema.optional(),
      card_data: invoiceCardDataSchema.optional(),
      web_data: invoiceWebDataSchema.optional(),
    })
    .optional(),
});

export type CreateWithdrawalRequestDto = z.infer<
  typeof createWithdrawalRequestSchema
>;
