import { z } from 'zod';
import { paymentInformationSchema } from './shared';

export const createAddressRequestSchema = paymentInformationSchema;

export type CreateAddressRequestDto = z.infer<
  typeof createAddressRequestSchema
>;
