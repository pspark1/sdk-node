import { z } from 'zod';

export const paymentInformationSchema = z.object({
  reference: z.string().describe('Your internal transaction ID'),
  title: z.string().optional().describe('Title of the payment'),
  description: z.string().optional().describe('Description of the payment'),
  limit_minute: z
    .number()
    .optional()
    .describe('TTL (time to live) for the address'),
  callback_url: z
    .string()
    .optional()
    .describe(
      'Url on which the webhook events should be sent. Can be configures in the cabinet settings.',
    ),
});

export const invoiceCustomerSchema = z.object({
  first_name: z.string().optional().describe('First name of the customer'),
  last_name: z.string().optional().describe('Last name of the customer'),
  email: z.string().optional().describe('Email of the customer'),
  phone: z.string().optional().describe('Phone number of the customer'),
  customer_id: z.string().optional().describe('The ID of the customer'),
  national_id: z
    .string()
    .optional()
    .describe('The national ID of the customer'),
  taxpayer_identification_number: z
    .string()
    .optional()
    .describe('The tax payer identification number'),
});

export const invoiceBillingInfoSchema = z.object({
  address: z.string().optional().describe('Address of the customer'),
  country_code: z.string().optional().describe('Country code of the customer'),
  country: z.string().optional().describe('Country of the customer'),
  city: z.string().optional().describe('City of the customer'),
  post_code: z
    .string()
    .optional()
    .describe("Post code of the customer' address"),
  region: z.string().optional().describe("Region of the customer's country"),
  payment_purpose: z.string().optional().describe('Payment puprose message'),
  street: z.string().optional().describe('Street name'),
});

export const invoiceBankInfoSchema = z.object({
  account: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  bic_code: z.string().optional(),
});

export const invoiceCardDataSchema = z.object({
  exp_month: z.string().optional(),
  exp_year: z.string().optional(),
});

export const invoiceWebDataSchema = z.object({
  ip: z.string().optional(),
  user_agent: z.string().optional(),
});

export const invoiceUISchema = z.object({
  language: z.enum(['en', 'ua', 'ru']).optional(),
});

export const invoiceEscrowPaymentSchema = z.object({
  payment_wallet_id: z.string().optional(),
});
