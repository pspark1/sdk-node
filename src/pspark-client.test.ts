import { vi } from 'vitest';
import { PSPark } from './pspark-client';
import { generateKeyPairSync } from 'crypto';

import * as nodeFetch from 'node-fetch';
import { Response } from 'node-fetch';
import { ResponseValidationError } from './errors';
import { API_VERSION, BASE_URL } from './contants';

vi.mock('node-fetch', async () => {
  const actual: typeof nodeFetch = await vi.importActual('node-fetch');

  return {
    ...actual,
    default: vi.fn(),
  };
});

const fetch = vi.mocked(nodeFetch.default);

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const apiKey = 'test-key';
const walletId = 'wallet-id';
const baseUrl = `${BASE_URL}/${API_VERSION}`;

function generateValidResponseBody(data: unknown = {}) {
  return JSON.stringify({
    code: 0,
    message: 'OK',
    data,
  });
}

describe('PSPark client', () => {
  it('appends authentication headers to the request', async () => {
    fetch.mockImplementationOnce(async (_, init) => {
      // @ts-expect-error headers are not typed
      expect(init.headers['X-API-key']!).toBe(apiKey);
      // @ts-expect-error headers are not typed
      expect(init.headers.Authorization).toMatch(/^Bearer /);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.getBalances();
  });

  it('appends iat, exp and nonce to the request body', async () => {
    fetch.mockImplementationOnce(async (_, init) => {
      const body = JSON.parse(init?.body as string);
      expect(body).toHaveProperty('iat');
      expect(body).toHaveProperty('exp');
      expect(body).toHaveProperty('nonce');
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.getBalances();
  });

  it('sets expiry to 30 seconds from the current time', async () => {
    vi.setSystemTime(0);

    fetch.mockImplementationOnce(async (_, init) => {
      const body = JSON.parse(init?.body as string);
      expect(body.exp).toBe(30);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.getBalances();
  });

  it('throws ResponseValidationError if the response is not successful', async () => {
    fetch.mockImplementationOnce(async () => {
      return new Response(JSON.stringify({ code: 1, message: 'Error' }));
    });

    const client = new PSPark(privateKey, apiKey);
    await expect(client.getBalances()).rejects.toThrowError(
      ResponseValidationError,
    );
  });

  it('calls get balance endpoint', async () => {
    fetch.mockImplementationOnce(async (url) => {
      expect(url).toBe(`${baseUrl}/wallet/${walletId}/balance`);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.getBalance(walletId);
  });

  it('calls get balances endpoint', async () => {
    fetch.mockImplementationOnce(async (url) => {
      expect(url).toBe(`${baseUrl}/balances`);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.getBalances();
  });

  it('calls create invoice endpoint', async () => {
    const invoiceData = {
      reference: '123',
      amount: 10,
      currency: 'USD',
      return_url: 'https://example.com',
    };

    fetch.mockImplementationOnce(async (url, init) => {
      expect(url).toBe(`${baseUrl}/wallet/${walletId}/invoice/create`);

      const body = JSON.parse(init?.body as string);
      expect(body).toMatchObject(invoiceData);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.createInvoice(walletId, invoiceData);
  });

  it('calls create withdrawal endpoint', async () => {
    const withdrawalData = {
      reference: '123',
      amount: 10,
      account: '3458f84a-07be-4b32-8a65-76434dc57fa1',
    };

    fetch.mockImplementationOnce(async (url, init) => {
      expect(url).toBe(`${baseUrl}/wallet/${walletId}/withdrawal/create`);

      const body = JSON.parse(init?.body as string);
      expect(body).toMatchObject(withdrawalData);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.createWithdrawal(walletId, withdrawalData);
  });

  it('calls create address endpoint', async () => {
    const addressData = {
      reference: '123',
      amount: 10,
      account: '3458f84a-07be-4b32-8a65-76434dc57fa1',
    };

    fetch.mockImplementationOnce(async (url, init) => {
      expect(url).toBe(`${baseUrl}/wallet/${walletId}/address/create`);

      const body = JSON.parse(init?.body as string);
      expect(body).toMatchObject(addressData);
      return new Response(generateValidResponseBody());
    });

    const client = new PSPark(privateKey, apiKey);
    await client.createAddress(walletId, addressData);
  });
});
