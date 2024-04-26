export interface ResponseDTO<T = Record<string, unknown>> {
  code: number;
  message: string;
  data: T;
}

export interface WalletBalance {
  wallet_id: string;
  currency: string;
  name: string;
  balance: string;
}

export type CreateInvoiceResponseDto = ResponseDTO<{
  id: string;
  reference: string;
  wallet_id: string;
  currency: string;
  amount: number;
  amount_initial: number;
  type: string;
  status: string;
  status_code?: number | null;
  status_message?: string | null;
  payment_fee: number;
  address?: string | null;
  memo?: string | null;
  flowData?: {
    action: string;
    method: string;
    params: unknown[];
  };
}>;
export type WalletBalanceResponseDto = ResponseDTO<WalletBalance>;
export type WalletBalancesResponseDto = ResponseDTO<
  Record<string, WalletBalance>
>;

export type CreateAddressResponseDto = ResponseDTO<{
  id: string;
  reference: string;
  wallet_id: string;
  currency: string;
  amount: number;
  amount_initial: number;
  type: string;
  status: string;
  status_code?: number | null;
  status_message?: string | null;
  payment_fee: number;
  address?: string | null;
  memo?: string | null;
}>;

export type CreateWithdrawalResponseDto = ResponseDTO<{
  id: string;
  reference: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  status_code?: number | null;
  status_message?: string | null;
  payment_fee: number;
  amount_spent: number;
}>;
