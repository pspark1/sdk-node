import { PSPark } from './pspark-client';
import { PSParkS2S } from './pspark-s2s-client';

export type {
  WalletBalance,
  WalletBalanceResponseDto,
  WalletBalancesResponseDto,
  CreateAddressResponseDto,
  CreateInvoiceResponseDto,
  CreateWithdrawalResponseDto,
} from './types';
export type {
  CreateAddressRequestDto,
  CreateInvoiceRequestDto,
  CreateWithdrawalRequestDto,
} from './schemes';

export { 
  PSPark, 
  PSParkS2S 
};
