import { BASE_URL, API_VERSION } from './contants';
import { ResponseValidationError } from './errors/responseValidationError';
import { signToken } from './utils/signToken';
import {
  CreateInvoiceResponseDto,
  ResponseDTO,
} from './types';
import {
  CreateInvoiceRequestDto,
  createInvoiceRequestSchema,
} from './schemes';

import fetch from 'node-fetch';

export class PSParkS2S {
  constructor(
    private secret: string,
    private apiKey: string,
    private baseUrl: string = BASE_URL,
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
        `wallet/${walletId}/invoice-s2s/create`,
        data,
      );

    return response;
  }

  private async makeAuthenticatedRequest<TResponseType>(
    url: string,
    requestBody: Record<string, unknown> = {},
  ): Promise<TResponseType> {
    const fullUrl = `${this.baseUrl}/${API_VERSION}/${url}`;

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
