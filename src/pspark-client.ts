import { BASE_URL, API_VERSION } from './contants';
import { ResponseValidationError } from './errors/responseValidationError';
import { signToken } from './utils/signToken';
import {
  CreateAddressResponseDto,
  CreateInvoiceResponseDto,
  CreateWithdrawalResponseDto,
  ResponseDTO,
  WalletBalance,
  WalletBalanceResponseDto,
  WalletBalancesResponseDto,
} from './types';
import {
  CreateAddressRequestDto,
  CreateInvoiceRequestDto,
  CreateWithdrawalRequestDto,
  createAddressRequestSchema,
  createInvoiceRequestSchema,
  createWithdrawalRequestSchema,
} from './schemes';

import fetch from 'node-fetch';

/**
 *
 * PSPark API Client
 *
 * @see https://doc.pspark.io/#section/PSPark-API
 */
export class PSPark {
  constructor(
    private secret: string,
    private apiKey: string,
  ) {}

  /**
   *  Creates an invoice
   *
   * @param {string} walletId - The ID of the wallet
   * @param {CreateInvoiceRequestDto} invoiceData - The invoice data
   *
   * @throws {ResponseValidationError} If the response is not successful
   * @throws {ZodError} If the request data is invalid
   */
  public async createInvoice(
    walletId: string,
    invoiceData: CreateInvoiceRequestDto,
  ): Promise<CreateInvoiceResponseDto> {
    const data = await createInvoiceRequestSchema
      .passthrough()
      .parseAsync(invoiceData);

    const response =
      await this.makeAuthenticatedRequest<CreateInvoiceResponseDto>(
        `wallet/${walletId}/invoice/create`,
        data,
      );

    return response;
  }

  /**
   * Creates an address
   *
   * @param {string} walletId - The ID of the wallet
   * @param {CreateAddressRequestDto} addressData - The address data
   *
   * @throws {ResponseValidationError} If the response is not successful
   * @throws {ZodError} If the request data is invalid
   */
  public async createAddress(
    walletId: string,
    addressData: CreateAddressRequestDto,
  ): Promise<CreateAddressResponseDto> {
    const data = await createAddressRequestSchema
      .passthrough()
      .parseAsync(addressData);

    const response =
      await this.makeAuthenticatedRequest<CreateAddressResponseDto>(
        `wallet/${walletId}/address/create`,
        data,
      );

    return response;
  }

  /**
   *
   * @param {string} walletId - The ID of the wallet
   * @param {CreateWithdrawalRequestDto} withdrawalData - The withdrawal data
   *
   * @throws {ResponseValidationError} If the response is not successful
   * @throws {ZodError} If the request data is invalid
   *
   */
  public async createWithdrawal(
    walletId: string,
    withdrawalData: CreateWithdrawalRequestDto,
  ): Promise<CreateWithdrawalResponseDto> {
    const data = await createWithdrawalRequestSchema
      .passthrough()
      .parseAsync(withdrawalData);

    const response =
      await this.makeAuthenticatedRequest<CreateWithdrawalResponseDto>(
        `wallet/${walletId}/withdrawal/create`,
        data,
      );

    return response;
  }

  /**
   * Gets the balances of all wallets
   *
   * @throws {ResponseValidationError} If the response is not successful
   */
  public async getBalances(): Promise<WalletBalance[]> {
    const response =
      await this.makeAuthenticatedRequest<WalletBalancesResponseDto>(
        'balances',
      );

    return Object.values(response.data);
  }

  /**
   * Gets the balance of a wallet
   *
   * @param {string} walletId - The ID of the wallet
   *
   * @throws {ResponseValidationError} If the response is not successful
   */
  public async getBalance(walletId: string): Promise<WalletBalance> {
    const response =
      await this.makeAuthenticatedRequest<WalletBalanceResponseDto>(
        `wallet/${walletId}/balance`,
      );

    return response.data;
  }

  private async makeAuthenticatedRequest<TResponseType>(
    url: string,
    requestBody: Record<string, unknown> = {},
  ): Promise<TResponseType> {
    const fullUrl = `${BASE_URL}/${API_VERSION}/${url}`;

    const { token, body } = signToken(this.secret, requestBody);

    const res = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'X-API-key': this.apiKey,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as ResponseDTO;

    if (data?.code > 0 || data.message?.toLocaleLowerCase() !== 'ok') {
      throw new ResponseValidationError(data.message, data.code, data.data);
    }

    return data as TResponseType;
  }
}
