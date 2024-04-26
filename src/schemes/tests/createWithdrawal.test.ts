import {
  CreateWithdrawalRequestDto,
  createWithdrawalRequestSchema,
} from '../createWithdrawal';

const validData: CreateWithdrawalRequestDto = {
  reference: '123',
  amount: 10,
  account: 'address',
  details: {},
};

const requiredFields = ['reference', 'amount', 'account'];
const optionalFields = ['details'];

describe('createWithdrawalRequestSchema', () => {
  it('passes with valid data', () => {
    expect(createWithdrawalRequestSchema.safeParse(validData)).toMatchObject({
      success: true,
      data: validData,
    });
  });

  it('requires amount to be positive', () => {
    const data = { ...validData, amount: -1 };

    expect(createWithdrawalRequestSchema.safeParse(data)).toMatchObject({
      success: false,
    });
  });

  it.each(requiredFields)('fails without required field: %s', (field) => {
    const data = { ...validData, [field]: undefined };

    expect(createWithdrawalRequestSchema.safeParse(data)).toMatchObject({
      success: false,
    });
  });

  it.each(optionalFields)('passes without optional field: %s', (field) => {
    const data = { ...validData, [field]: undefined };

    expect(createWithdrawalRequestSchema.safeParse(data)).toMatchObject({
      success: true,
      data: data,
    });
  });
});
