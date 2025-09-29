// Helper for building provider-correct SMS order payloads

export type SmsOrderMode = 'auto' | 'manual';
export type SmsProvider = 'tiger_sms' | '5sim' | 'dassy' | 'textverified' | 'smspool';

export interface SmsOrderPayload {
  country: string; // ISO2, uppercase
  service: string; // string or numeric; validated per provider
  mode: SmsOrderMode;
  provider?: SmsProvider;
  user_id?: number;
}

export const payloadSamples: Record<SmsProvider | 'auto', SmsOrderPayload> = {
  auto: { country: 'NG', service: 'whatsapp', mode: 'auto' },
  tiger_sms: { country: 'NG', service: 'whatsapp', mode: 'manual', provider: 'tiger_sms' },
  '5sim': { country: 'NG', service: 'whatsapp', mode: 'manual', provider: '5sim' },
  dassy: { country: 'NG', service: 'telegram', mode: 'manual', provider: 'dassy' },
  textverified: { country: 'US', service: 'uber', mode: 'manual', provider: 'textverified' },
  smspool: { country: 'DZ', service: '829', mode: 'manual', provider: 'smspool' },
};

function isNumericString(value: string): boolean {
  return /^\d+$/.test(String(value || ''));
}

export function normalizeOrderPayload(payload: SmsOrderPayload): SmsOrderPayload {
  const provider = payload.provider as SmsProvider | undefined;
  const result: SmsOrderPayload = {
    ...payload,
    country: (provider === 'textverified' ? 'US' : payload.country).toUpperCase(),
    service: String(payload.service ?? '').trim(),
  };

  if (result.mode === 'manual' && !provider) {
    throw new Error('Manual mode requires a provider.');
  }

  if (!result.country || result.country.length < 2) {
    throw new Error('Country is required (ISO2).');
  }
  if (!result.service) {
    throw new Error('Service is required.');
  }

  if (provider === 'textverified') {
    // TextVerified requires US-only and serviceName (non-numeric)
    if (isNumericString(result.service)) {
      throw new Error('TextVerified requires serviceName (string), not numeric code.');
    }
  } else if (provider === 'smspool') {
    // SMSPool accepts numeric codes; leave as-is
  } else if (provider === 'tiger_sms' || provider === '5sim' || provider === 'dassy') {
    // These providers require string service codes
    if (isNumericString(result.service)) {
      throw new Error('Selected provider requires a string service code (e.g., "whatsapp").');
    }
  }

  return result;
}


