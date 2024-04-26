import {
  CreateAddressRequestDto,
  createAddressRequestSchema,
} from '../createAddress';

const validData: CreateAddressRequestDto = {
  reference: '123',
  title: 'Test',
  description: 'Test',
  limit_minute: 10,
  callback_url: 'https://example.com',
};

const requiredFields = ['reference'];
const optionalFields = ['title', 'description', 'limit_minute', 'callback_url'];

describe('createAddressRequestSchema', () => {
  it('passes with valid data', () => {
    expect(createAddressRequestSchema.safeParse(validData)).toMatchObject({
      success: true,
      data: validData,
    });
  });

  it.each(requiredFields)('fails without required field: %s', (field) => {
    const data = { ...validData, [field]: undefined };

    expect(createAddressRequestSchema.safeParse(data)).toMatchObject({
      success: false,
    });
  });

  it.each(optionalFields)('passes without optional field: %s', (field) => {
    const data = { ...validData, [field]: undefined };

    expect(createAddressRequestSchema.safeParse(data)).toMatchObject({
      success: true,
      data: data,
    });
  });
});
