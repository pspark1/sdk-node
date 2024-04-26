import {
  CreateInvoiceRequestDto,
  createInvoiceRequestSchema,
} from '../createInvoice';

const validData: CreateInvoiceRequestDto = {
  amount: 10,
  currency: 'USD',
  return_url: 'https://example.com',
  reference: '123',
  title: 'Test',
  description: 'Test',
  limit_minute: 10,
  callback_url: 'https://example.com',
  details: {},
};

const requiredFields = ['reference', 'amount', 'currency', 'return_url'];
const optionalFields = [
  'title',
  'description',
  'limit_minute',
  'callback_url',
  'details',
];

describe('createInvoiceRequestSchema', () => {
  it('passes with valid data', () => {
    expect(createInvoiceRequestSchema.safeParse(validData)).toMatchObject({
      success: true,
      data: validData,
    });
  });

  it('requires amount to be positive', () => {
    const data = { ...validData, amount: -1 };

    expect(createInvoiceRequestSchema.safeParse(data)).toMatchObject({
      success: false,
    });
  });

  it.each(requiredFields)('fails without required field: %s', (field) => {
    const data = { ...validData, [field]: undefined };

    expect(createInvoiceRequestSchema.safeParse(data)).toMatchObject({
      success: false,
    });
  });

  it.each(optionalFields)('passes without optional field: %s', (field) => {
    const data = { ...validData, [field]: undefined };

    expect(createInvoiceRequestSchema.safeParse(data)).toMatchObject({
      success: true,
      data: data,
    });
  });
});
