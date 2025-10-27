import { apiService } from './api';

// SMS API Types
export interface SmsCountry {
  code: string;
  name: string;
  flag?: string;
  provider: string;
}

export interface SmsService {
  id?: number;
  name: string;
  service: string;
  cost: number;
  count: number;
  provider: string;
  provider_name: string;
  description?: string;
  status?: string;
  priority?: number;
  success_rate?: number;
  currency?: string;
}

export interface SmsOrder {
  id: string;
  order_id: string;
  phone_number: string;
  phone: string;
  service: string;
  country: string;
  cost: number;
  amount: number;
  status: string;
  expires_at: string;
  provider: string;
  provider_name: string;
  mode: string;
  success_rate: number;
  currency: string;
  reference: string;
  created_at: string;
  updated_at: string;
  message?: string;
}

export interface SmsProvider {
  id: number;
  name: string;
  provider: string;
  success_rate: number;
  total_orders: number;
  successful_orders: number;
  balance: number;
  last_balance_check: string;
  status: string;
  display_name: string;
}

export interface SmsCodeResponse {
  sms_code: string | null;
  status: string;
  received_at?: string;
  message?: string;
}

export interface SmsOrderHistory {
  order_id: string;
  phone_number: string;
  service: string;
  country: string;
  cost: number;
  status: string;
  status_label: string;
  sms_code?: string | null;
  expires_at?: string | null;
  received_at?: string | null;
  provider: string;
  created_at: string;
}

export interface SmsStats {
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  total_spent: number;
  recent_orders: Array<{
    order_id: string;
    service: string;
    status: string;
    created_at: string;
  }>;
}

// Provider display name mapping (fallback if backend doesn't provide provider_name)
const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  'tiger_sms': 'FADDED GLOBAL',
  '5sim': 'FADDED SIM',
  'dassy': 'FADDED USA ONLY',
  'smspool': 'FADDED POOL',
  'textverified': 'FADDED VERIFIED',
  'auto': 'Auto Select'
};

// Comprehensive country code to name mapping
const COUNTRY_CODE_TO_NAME: Record<string, { name: string; flag: string; iso2: string; cacheCode?: string }> = {
  '1': { name: 'United States', flag: '🇺🇸', iso2: 'US' },
  '2': { name: 'Canada', flag: '🇨🇦', iso2: 'CA', cacheCode: 'canada' },
  '3': { name: 'United Kingdom', flag: '🇬🇧', iso2: 'GB', cacheCode: 'england' },
  '4': { name: 'France', flag: '🇫🇷', iso2: 'FR', cacheCode: 'france' },
  '5': { name: 'Germany', flag: '🇩🇪', iso2: 'DE', cacheCode: 'germany' },
  '6': { name: 'Italy', flag: '🇮🇹', iso2: 'IT' },
  '7': { name: 'Spain', flag: '🇪🇸', iso2: 'ES' },
  '8': { name: 'Netherlands', flag: '🇳🇱', iso2: 'NL' },
  '9': { name: 'Belgium', flag: '🇧🇪', iso2: 'BE' },
  '10': { name: 'Switzerland', flag: '🇨🇭', iso2: 'CH' },
  '11': { name: 'Austria', flag: '🇦🇹', iso2: 'AT' },
  '12': { name: 'Sweden', flag: '🇸🇪', iso2: 'SE' },
  '13': { name: 'Norway', flag: '🇳🇴', iso2: 'NO' },
  '14': { name: 'Denmark', flag: '🇩🇰', iso2: 'DK' },
  '15': { name: 'Finland', flag: '🇫🇮', iso2: 'FI' },
  '16': { name: 'Poland', flag: '🇵🇱', iso2: 'PL' },
  '17': { name: 'Czech Republic', flag: '🇨🇿', iso2: 'CZ' },
  '18': { name: 'Hungary', flag: '🇭🇺', iso2: 'HU' },
  '19': { name: 'Romania', flag: '🇷🇴', iso2: 'RO' },
  '20': { name: 'Bulgaria', flag: '🇧🇬', iso2: 'BG' },
  '21': { name: 'Croatia', flag: '🇭🇷', iso2: 'HR' },
  '22': { name: 'Slovakia', flag: '🇸🇰', iso2: 'SK' },
  '23': { name: 'Slovenia', flag: '🇸🇮', iso2: 'SI' },
  '24': { name: 'Estonia', flag: '🇪🇪', iso2: 'EE' },
  '25': { name: 'Latvia', flag: '🇱🇻', iso2: 'LV' },
  '26': { name: 'Lithuania', flag: '🇱🇹', iso2: 'LT' },
  '27': { name: 'Ireland', flag: '🇮🇪', iso2: 'IE' },
  '28': { name: 'Portugal', flag: '🇵🇹', iso2: 'PT' },
  '29': { name: 'Greece', flag: '🇬🇷', iso2: 'GR' },
  '30': { name: 'Cyprus', flag: '🇨🇾', iso2: 'CY' },
  '31': { name: 'Malta', flag: '🇲🇹', iso2: 'MT' },
  '32': { name: 'Luxembourg', flag: '🇱🇺', iso2: 'LU' },
  '33': { name: 'Iceland', flag: '🇮🇸', iso2: 'IS' },
  '34': { name: 'Liechtenstein', flag: '🇱🇮', iso2: 'LI' },
  '35': { name: 'Monaco', flag: '🇲🇨', iso2: 'MC' },
  '36': { name: 'San Marino', flag: '🇸🇲', iso2: 'SM' },
  '37': { name: 'Vatican City', flag: '🇻🇦', iso2: 'VA' },
  '38': { name: 'Andorra', flag: '🇦🇩', iso2: 'AD' },
  '39': { name: 'Russia', flag: '🇷🇺', iso2: 'RU' },
  '40': { name: 'Ukraine', flag: '🇺🇦', iso2: 'UA' },
  '41': { name: 'Belarus', flag: '🇧🇾', iso2: 'BY' },
  '42': { name: 'Moldova', flag: '🇲🇩', iso2: 'MD' },
  '43': { name: 'Turkey', flag: '🇹🇷', iso2: 'TR' },
  '44': { name: 'Israel', flag: '🇮🇱', iso2: 'IL' },
  '45': { name: 'Palestine', flag: '🇵🇸', iso2: 'PS' },
  '46': { name: 'Jordan', flag: '🇯🇴', iso2: 'JO' },
  '47': { name: 'Lebanon', flag: '🇱🇧', iso2: 'LB' },
  '48': { name: 'Syria', flag: '🇸🇾', iso2: 'SY' },
  '49': { name: 'Iraq', flag: '🇮🇶', iso2: 'IQ' },
  '50': { name: 'Iran', flag: '🇮🇷', iso2: 'IR' },
  '51': { name: 'Saudi Arabia', flag: '🇸🇦', iso2: 'SA' },
  '52': { name: 'United Arab Emirates', flag: '🇦🇪', iso2: 'AE' },
  '53': { name: 'Kuwait', flag: '🇰🇼', iso2: 'KW' },
  '54': { name: 'Qatar', flag: '🇶🇦', iso2: 'QA' },
  '55': { name: 'Bahrain', flag: '🇧🇭', iso2: 'BH' },
  '56': { name: 'Oman', flag: '🇴🇲', iso2: 'OM' },
  '57': { name: 'Yemen', flag: '🇾🇪', iso2: 'YE' },
  '58': { name: 'Afghanistan', flag: '🇦🇫', iso2: 'AF' },
  '59': { name: 'Pakistan', flag: '🇵🇰', iso2: 'PK' },
  '60': { name: 'India', flag: '🇮🇳', iso2: 'IN', cacheCode: '22' },
  '61': { name: 'Bangladesh', flag: '🇧🇩', iso2: 'BD' },
  '62': { name: 'Sri Lanka', flag: '🇱🇰', iso2: 'LK' },
  '63': { name: 'Nepal', flag: '🇳🇵', iso2: 'NP' },
  '64': { name: 'Bhutan', flag: '🇧🇹', iso2: 'BT' },
  '65': { name: 'Maldives', flag: '🇲🇻', iso2: 'MV' },
  '66': { name: 'China', flag: '🇨🇳', iso2: 'CN' },
  '67': { name: 'Japan', flag: '🇯🇵', iso2: 'JP' },
  '68': { name: 'South Korea', flag: '🇰🇷', iso2: 'KR' },
  '69': { name: 'North Korea', flag: '🇰🇵', iso2: 'KP' },
  '70': { name: 'Mongolia', flag: '🇲🇳', iso2: 'MN' },
  '71': { name: 'Taiwan', flag: '🇹🇼', iso2: 'TW' },
  '72': { name: 'Hong Kong', flag: '🇭🇰', iso2: 'HK' },
  '73': { name: 'Macau', flag: '🇲🇴', iso2: 'MO' },
  '74': { name: 'Thailand', flag: '🇹🇭', iso2: 'TH' },
  '75': { name: 'Vietnam', flag: '🇻🇳', iso2: 'VN' },
  '76': { name: 'Cambodia', flag: '🇰🇭', iso2: 'KH' },
  '77': { name: 'Laos', flag: '🇱🇦', iso2: 'LA' },
  '78': { name: 'Myanmar', flag: '🇲🇲', iso2: 'MM' },
  '79': { name: 'Malaysia', flag: '🇲🇾', iso2: 'MY' },
  '80': { name: 'Singapore', flag: '🇸🇬', iso2: 'SG' },
  '81': { name: 'Indonesia', flag: '🇮🇩', iso2: 'ID' },
  '82': { name: 'Philippines', flag: '🇵🇭', iso2: 'PH' },
  '83': { name: 'Brunei', flag: '🇧🇳', iso2: 'BN' },
  '84': { name: 'East Timor', flag: '🇹🇱', iso2: 'TL' },
  '85': { name: 'Papua New Guinea', flag: '🇵🇬', iso2: 'PG' },
  '86': { name: 'Australia', flag: '🇦🇺', iso2: 'AU', cacheCode: 'australia' },
  '87': { name: 'New Zealand', flag: '🇳🇿', iso2: 'NZ' },
  '88': { name: 'Fiji', flag: '🇫🇯', iso2: 'FJ' },
  '89': { name: 'Solomon Islands', flag: '🇸🇧', iso2: 'SB' },
  '90': { name: 'Vanuatu', flag: '🇻🇺', iso2: 'VU' },
  '91': { name: 'Samoa', flag: '🇼🇸', iso2: 'WS' },
  '92': { name: 'Tonga', flag: '🇹🇴', iso2: 'TO' },
  '93': { name: 'Kiribati', flag: '🇰🇮', iso2: 'KI' },
  '94': { name: 'Tuvalu', flag: '🇹🇻', iso2: 'TV' },
  '95': { name: 'Nauru', flag: '🇳🇷', iso2: 'NR' },
  '96': { name: 'Palau', flag: '🇵🇼', iso2: 'PW' },
  '97': { name: 'Marshall Islands', flag: '🇲🇭', iso2: 'MH' },
  '98': { name: 'Micronesia', flag: '🇫🇲', iso2: 'FM' },
  '99': { name: 'Cook Islands', flag: '🇨🇰', iso2: 'CK' },
  '100': { name: 'Niue', flag: '🇳🇺', iso2: 'NU' },
  '101': { name: 'Tokelau', flag: '🇹🇰', iso2: 'TK' },
  '102': { name: 'American Samoa', flag: '🇦🇸', iso2: 'AS' },
  '103': { name: 'Guam', flag: '🇬🇺', iso2: 'GU' },
  '104': { name: 'Northern Mariana Islands', flag: '🇲🇵', iso2: 'MP' },
  '105': { name: 'Puerto Rico', flag: '🇵🇷', iso2: 'PR' },
  '106': { name: 'US Virgin Islands', flag: '🇻🇮', iso2: 'VI' },
  '107': { name: 'British Virgin Islands', flag: '🇻🇬', iso2: 'VG' },
  '108': { name: 'Anguilla', flag: '🇦🇮', iso2: 'AI' },
  '109': { name: 'Montserrat', flag: '🇲🇸', iso2: 'MS' },
  '110': { name: 'Saint Kitts and Nevis', flag: '🇰🇳', iso2: 'KN' },
  '111': { name: 'Antigua and Barbuda', flag: '🇦🇬', iso2: 'AG' },
  '112': { name: 'Dominica', flag: '🇩🇲', iso2: 'DM' },
  '113': { name: 'Saint Lucia', flag: '🇱🇨', iso2: 'LC' },
  '114': { name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', iso2: 'VC' },
  '115': { name: 'Grenada', flag: '🇬🇩', iso2: 'GD' },
  '116': { name: 'Barbados', flag: '🇧🇧', iso2: 'BB' },
  '117': { name: 'Trinidad and Tobago', flag: '🇹🇹', iso2: 'TT' },
  '118': { name: 'Jamaica', flag: '🇯🇲', iso2: 'JM' },
  '119': { name: 'Cuba', flag: '🇨🇺', iso2: 'CU' },
  '120': { name: 'Haiti', flag: '🇭🇹', iso2: 'HT' },
  '121': { name: 'Dominican Republic', flag: '🇩🇴', iso2: 'DO' },
  '122': { name: 'Bahamas', flag: '🇧🇸', iso2: 'BS' },
  '123': { name: 'Belize', flag: '🇧🇿', iso2: 'BZ' },
  '124': { name: 'Guatemala', flag: '🇬🇹', iso2: 'GT' },
  '125': { name: 'Honduras', flag: '🇭🇳', iso2: 'HN' },
  '126': { name: 'El Salvador', flag: '🇸🇻', iso2: 'SV' },
  '127': { name: 'Nicaragua', flag: '🇳🇮', iso2: 'NI' },
  '128': { name: 'Costa Rica', flag: '🇨🇷', iso2: 'CR' },
  '129': { name: 'Panama', flag: '🇵🇦', iso2: 'PA' },
  '130': { name: 'Mexico', flag: '🇲🇽', iso2: 'MX', cacheCode: 'mexico' },
  '131': { name: 'Brazil', flag: '🇧🇷', iso2: 'BR' },
  '132': { name: 'Argentina', flag: '🇦🇷', iso2: 'AR' },
  '133': { name: 'Chile', flag: '🇨🇱', iso2: 'CL' },
  '134': { name: 'Peru', flag: '🇵🇪', iso2: 'PE' },
  '135': { name: 'Colombia', flag: '🇨🇴', iso2: 'CO' },
  '136': { name: 'Venezuela', flag: '🇻🇪', iso2: 'VE' },
  '137': { name: 'Ecuador', flag: '🇪🇨', iso2: 'EC' },
  '138': { name: 'Bolivia', flag: '🇧🇴', iso2: 'BO' },
  '139': { name: 'Paraguay', flag: '🇵🇾', iso2: 'PY' },
  '140': { name: 'Uruguay', flag: '🇺🇾', iso2: 'UY' },
  '141': { name: 'Guyana', flag: '🇬🇾', iso2: 'GY' },
  '142': { name: 'Suriname', flag: '🇸🇷', iso2: 'SR' },
  '143': { name: 'French Guiana', flag: '🇬🇫', iso2: 'GF' },
  '144': { name: 'Falkland Islands', flag: '🇫🇰', iso2: 'FK' },
  '145': { name: 'South Georgia', flag: '🇬🇸', iso2: 'GS' },
  '146': { name: 'South Africa', flag: '🇿🇦', iso2: 'ZA' },
  '147': { name: 'Namibia', flag: '🇳🇦', iso2: 'NA' },
  '148': { name: 'Botswana', flag: '🇧🇼', iso2: 'BW' },
  '149': { name: 'Germany', flag: '🇩🇪', iso2: 'DE' },
  '150': { name: 'Zimbabwe', flag: '🇿🇼', iso2: 'ZW' },
  '151': { name: 'Zambia', flag: '🇿🇲', iso2: 'ZM' },
  '152': { name: 'Malawi', flag: '🇲🇼', iso2: 'MW' },
  '153': { name: 'Mozambique', flag: '🇲🇿', iso2: 'MZ' },
  '154': { name: 'Madagascar', flag: '🇲🇬', iso2: 'MG' },
  '155': { name: 'Mauritius', flag: '🇲🇺', iso2: 'MU' },
  '156': { name: 'Seychelles', flag: '🇸🇨', iso2: 'SC' },
  '157': { name: 'Comoros', flag: '🇰🇲', iso2: 'KM' },
  '158': { name: 'Mayotte', flag: '🇾🇹', iso2: 'YT' },
  '159': { name: 'Réunion', flag: '🇷🇪', iso2: 'RE' },
  '160': { name: 'Kenya', flag: '🇰🇪', iso2: 'KE', cacheCode: 'kenya' },
  '161': { name: 'Tanzania', flag: '🇹🇿', iso2: 'TZ' },
  '162': { name: 'Uganda', flag: '🇺🇬', iso2: 'UG' },
  '163': { name: 'Rwanda', flag: '🇷🇼', iso2: 'RW' },
  '164': { name: 'Burundi', flag: '🇧🇮', iso2: 'BI' },
  '165': { name: 'Ethiopia', flag: '🇪🇹', iso2: 'ET' },
  '166': { name: 'Eritrea', flag: '🇪🇷', iso2: 'ER' },
  '167': { name: 'Djibouti', flag: '🇩🇯', iso2: 'DJ' },
  '168': { name: 'Somalia', flag: '🇸🇴', iso2: 'SO' },
  '169': { name: 'Sudan', flag: '🇸🇩', iso2: 'SD' },
  '170': { name: 'South Sudan', flag: '🇸🇸', iso2: 'SS' },
  '171': { name: 'Central African Republic', flag: '🇨🇫', iso2: 'CF' },
  '172': { name: 'Chad', flag: '🇹🇩', iso2: 'TD' },
  '173': { name: 'Cameroon', flag: '🇨🇲', iso2: 'CM' },
  '174': { name: 'Nigeria', flag: '🇳🇬', iso2: 'NG', cacheCode: 'nigeria' },
  '175': { name: 'Niger', flag: '🇳🇪', iso2: 'NE' },
  '176': { name: 'Mali', flag: '🇲🇱', iso2: 'ML' },
  '177': { name: 'Burkina Faso', flag: '🇧🇫', iso2: 'BF' },
  '178': { name: 'Senegal', flag: '🇸🇳', iso2: 'SN' },
  '179': { name: 'Gambia', flag: '🇬🇲', iso2: 'GM' },
  '180': { name: 'Guinea-Bissau', flag: '🇬🇼', iso2: 'GW' },
  '181': { name: 'Guinea', flag: '🇬🇳', iso2: 'GN' },
  '182': { name: 'Sierra Leone', flag: '🇸🇱', iso2: 'SL' },
  '183': { name: 'Liberia', flag: '🇱🇷', iso2: 'LR' },
  '184': { name: 'Ivory Coast', flag: '🇨🇮', iso2: 'CI' },
  '185': { name: 'Ghana', flag: '🇬🇭', iso2: 'GH' },
  '186': { name: 'Togo', flag: '🇹🇬', iso2: 'TG' },
  '187': { name: 'Benin', flag: '🇧🇯', iso2: 'BJ' },
  '188': { name: 'Cape Verde', flag: '🇨🇻', iso2: 'CV' },
  '189': { name: 'São Tomé and Príncipe', flag: '🇸🇹', iso2: 'ST' },
  '190': { name: 'Equatorial Guinea', flag: '🇬🇶', iso2: 'GQ' },
  '191': { name: 'Gabon', flag: '🇬🇦', iso2: 'GA' },
  '192': { name: 'Republic of the Congo', flag: '🇨🇬', iso2: 'CG' },
  '193': { name: 'Democratic Republic of the Congo', flag: '🇨🇩', iso2: 'CD' },
  '194': { name: 'Angola', flag: '🇦🇴', iso2: 'AO' },
  '195': { name: 'Algeria', flag: '🇩🇿', iso2: 'DZ' },
  '196': { name: 'Tunisia', flag: '🇹🇳', iso2: 'TN' },
  '197': { name: 'Libya', flag: '🇱🇾', iso2: 'LY' },
  '198': { name: 'Egypt', flag: '🇪🇬', iso2: 'EG' },
  '199': { name: 'Morocco', flag: '🇲🇦', iso2: 'MA' },
  '200': { name: 'Western Sahara', flag: '🇪🇭', iso2: 'EH' },
  '1001': { name: 'United States', flag: '🇺🇸', iso2: 'US' }
};

// Mock data for development (fallback)
const MOCK_SMS_COUNTRIES: SmsCountry[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', provider: 'auto' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', provider: 'auto' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', provider: 'auto' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', provider: 'auto' },
];

const MOCK_SMS_SERVICES: SmsService[] = [
  {
    id: 1,
    name: 'WhatsApp',
    service: 'whatsapp',
    cost: 1500,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  },
  {
    id: 2,
    name: 'Telegram',
    service: 'telegram',
    cost: 1500,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  },
  {
    id: 3,
    name: 'Google',
    service: 'google',
    cost: 2000,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  },
  {
    id: 4,
    name: 'Facebook',
    service: 'facebook',
    cost: 1500,
    count: 1,
    provider: 'auto',
    provider_name: 'Auto'
  }
];

const MOCK_SMS_PROVIDERS: SmsProvider[] = [
  {
    id: 1,
    name: 'Auto Provider',
    provider: 'auto',
    success_rate: 95,
    total_orders: 1250,
    successful_orders: 1188,
    balance: 5000,
    last_balance_check: '2024-01-15T10:30:00Z',
    status: 'active',
    display_name: 'Auto Selection'
  }
];

// import { API_SMS_URL } from './api';
import { normalizeOrderPayload, SmsOrderPayload } from './smsOrderPayload';

// SMS API Service
class SmsApiService {
  private baseUrl: string;
  private defaultTimeoutMs = 18000;
    private inboxEnabled: boolean;
  private static CACHE_VERSION = '2025-10-26-textverified-all-services-v3';
  // Frontend fallback FX/markup (used only if backend didn't convert)
  private getFxNgnPerUsd(): number {
    const v = Number((import.meta as any)?.env?.VITE_SMS_FX_NGN_PER_USD ?? 1600);
    return isFinite(v) && v > 0 ? v : 1600;
  }
  private getMarkupPercent(): number {
    const v = Number((import.meta as any)?.env?.VITE_SMS_MARKUP_PERCENT ?? 0);
    return isFinite(v) && v >= 0 ? v : 0;
  }
  private toNgn(cost: number): number {
    const fx = this.getFxNgnPerUsd();
    const mk = this.getMarkupPercent();
    return Math.ceil(Number(cost || 0) * fx * (1 + mk / 100));
  }

  constructor() {
    this.baseUrl = 'https://api.fadsms.com/api';
      this.inboxEnabled = String((import.meta as any)?.env?.VITE_ENABLE_INBOX_MESSAGES ?? '0') === '1';
    // One-time cache bust: clear old cached service data if version changed
    try {
      const current = localStorage.getItem('sms:cache:version');
      if (current !== SmsApiService.CACHE_VERSION) {
        const keys = Object.keys(localStorage);
        keys.forEach((k) => {
          if (k.startsWith('sms:services:') || k.startsWith('sms:countries:') || k.startsWith('sms:countriesByService:')) {
            localStorage.removeItem(k);
          }
        });
        localStorage.setItem('sms:cache:version', SmsApiService.CACHE_VERSION);
      }
    } catch {}
  }

  // Internal: build services cache key used by getServices
  private makeServicesCacheKey(country: string, provider?: string): string {
    const countryKey = (provider === 'textverified' ? 'US' : (country || 'US'));
    return `sms:services:v${SmsApiService.CACHE_VERSION}:${provider || 'auto'}:${countryKey}`;
  }

  // Internal: fetch with timeout (AbortController)
  private async fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), Math.max(1, timeoutMs));
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  }

  // Internal: read cached JSON from localStorage
  private readLocalCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { v, t, ttl } = JSON.parse(raw);
      if (!t || !ttl || Date.now() - t > ttl) return null;
      return v as T;
    } catch {
      return null;
    }
  }

  // Internal: write cached JSON to localStorage with TTL
  private writeLocalCache<T>(key: string, value: T, ttlMs: number): void {
    try {
      localStorage.setItem(key, JSON.stringify({ v: value, t: Date.now(), ttl: ttlMs }));
    } catch {}
  }

  // Helper: Get country display name and flag from country code
  getCountryDisplayInfo(countryCode: string): { name: string; flag: string; cacheCode?: string } {
    // Normalize special cases and casing
    const code = (countryCode || '').toUpperCase();
    const normalizedCode = code === 'UK' ? 'GB' : code;

    // First, try direct lookup with the provided country code
    if (COUNTRY_CODE_TO_NAME[normalizedCode]) {
      const mapped = COUNTRY_CODE_TO_NAME[normalizedCode];
      return { 
        name: mapped.name, 
        flag: mapped.flag,
        cacheCode: mapped.cacheCode
      };
    }
    
    // If not found, try to find by ISO2 code
    for (const [, countryData] of Object.entries(COUNTRY_CODE_TO_NAME)) {
      if (countryData.iso2 === normalizedCode) {
        return { 
          name: countryData.name, 
          flag: countryData.flag,
          cacheCode: countryData.cacheCode
        };
      }
    }
    
    // Fallback to existing logic
    return {
      name: normalizedCode || 'Unknown',
      flag: this.getCountryFlag(normalizedCode || 'US')
    };
  }

  // Helper: Get proper provider display name
  getProviderDisplayName(providerCode: string): string {
    return PROVIDER_DISPLAY_NAMES[providerCode] || providerCode.replace('_', ' ').toUpperCase();
  }

  /**
   * Get available countries from Laravel backend (using cached data)
   */
  async getCountries(provider?: string): Promise<SmsCountry[]> {
    // Use regular countries endpoint directly (cached endpoints are empty)
    try {
      console.log(`🚀 Fetching countries${provider ? ` for provider: ${provider}` : ''}`);
      
      const params = new URLSearchParams();
      if (provider) params.append('provider', provider);
      
      const response = await this.fetchWithTimeout(`${this.baseUrl}/sms/countries?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }, 8000);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch countries`);
      }

      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const countries = data.data.map((country: any) => ({
          id: country.code,
          code: country.code,
          name: country.name,
          flag: country.flag || this.getCountryFlag(country.code),
          provider: country.provider || 'auto'
        }));

        console.log(`✅ Loaded ${countries.length} countries`);
        return countries;
      } else {
        console.warn('⚠️ No countries found');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching countries:', error);
      return [];
    }
  }

  /**
   * Get available SMS services from Laravel backend
   */
  async getServices(country: string = '', provider?: string): Promise<SmsService[]> {
    try {
      // Serve from cache immediately if available (1h TTL), then rely on next call to refresh
      const cacheKey = `sms:services:v${SmsApiService.CACHE_VERSION}:${provider || 'auto'}:${country || 'US'}`;
      const cached = this.readLocalCache<SmsService[]>(cacheKey);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
      // Set generous timeouts for slower providers
      let timeoutMs = this.defaultTimeoutMs;
      if (provider === '5sim' || provider === 'dassy' || provider === 'textverified') timeoutMs = 18000;
      if (provider === 'smspool') timeoutMs = 25000;

      // For TextVerified, country is fixed to US by API. Keep request stable but normalize below.
      const effectiveCountry = provider === 'textverified' ? 'US' : (country || '');

      // Build query parameters for GET request instead of POST
      const params = new URLSearchParams();
      // Backend requires country parameter, use US as default if none provided
      const countryParam = effectiveCountry || 'US';
      params.append('country', countryParam);
      if (provider) params.append('provider', provider);
      
      // Add cache-busting parameter to prevent stale prices
      params.append('_t', Date.now().toString());

      const authToken = this.getAuthToken();
      if (!authToken) {
        console.warn('No auth token found, using fallback SMS services');
        return MOCK_SMS_SERVICES;
      }

      // Go directly to the services endpoint since catalog doesn't exist
      const url = `${this.baseUrl}/sms/services?${params.toString()}`;
      console.log('SMS API Request (services):', { url, country: countryParam, provider });

      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      }, Math.max(timeoutMs, this.defaultTimeoutMs));

      if (!response.ok) {
        console.warn(`SMS services endpoint returned ${response.status}, suppressing mock services`);
        return [];
      }

      const data = await response.json();

      const normalize = (service: any): SmsService | null => {
        const clampCost = (value: number): number => {
          const n = Math.ceil(Number(value || 0));
          if (!isFinite(n) || n <= 0) return 1500;
          return Math.max(1500, Math.min(n, 3000000));
        };
        // TextVerified returns { serviceName, capability }
        if (provider === 'textverified') {
          const name = service?.serviceName || service?.name;
          if (!name) return null;
          // Backend already returns NGN cost with clamps; use as-is and apply safety clamp only
          const ngn = clampCost(Number(service.cost ?? 0) || 1500);
          return {
            id: undefined,
            name,
            service: name,
            cost: ngn,
            count: Number(service.count ?? 1),
            provider: 'textverified',
            provider_name: 'FADDED VERIFIED',
            description: service.capability || 'sms',
            status: 'active',
            priority: 999,
            success_rate: 90,
            currency: 'NGN',
          };
        }

        // Tiger/5sim style normalized by backend but add guards
        const nm = service?.name || service?.service || '';
        const svc = service?.service || service?.code || nm?.toLowerCase?.() || '';
        if (!nm) return null;
        
        // Prefer explicit NGN cost if available; fallback to cost/price
        const ngnHint = service.ngn_cost ?? service.ngnPrice ?? null;
        const usdHint = service.usd_cost ?? service.usdPrice ?? null;
        let rawCost = Number(ngnHint ?? service.cost ?? service.price ?? 0);
        let currency = (service.currency || (ngnHint != null ? 'NGN' : (usdHint != null ? 'USD' : 'NGN')));
        // Convert USD to NGN if needed
        if (currency === 'USD' && isFinite(rawCost) && rawCost > 0) {
          rawCost = this.toNgn(rawCost);
          currency = 'NGN';
        }
        // Guard against zero/invalid backend pricing: fallback to safe minimum for display
        if (!isFinite(rawCost) || rawCost <= 0) {
          rawCost = 1500;
          currency = 'NGN';
        }
        
          // Ensure NGN display and clamp
          const displayCost = clampCost(currency === 'USD' ? this.toNgn(rawCost) : rawCost);
          return {
          id: service.id,
          name: nm,
          service: svc,
          cost: displayCost,
          count: Number(service.count ?? service.available ?? 0),
          provider: service.provider || provider || 'auto',
          provider_name: service.provider_name || service.provider || 'Auto',
          description: service.description,
          status: service.status ?? 'active',
          priority: Number(service.priority ?? 1),
          success_rate: Number(service.success_rate ?? 95),
          currency: 'NGN', // Normalize to NGN for display
        };
      };
      
      if (data.success && data.data) {
        let mapped = (data.data as any[]).map(normalize).filter(Boolean) as SmsService[];
        // Frontend fallback conversion: convert only if backend did not provide NGN
        mapped = mapped.map((item) => {
          const currency = (item as any).currency;
          const needsConvert = !currency || currency !== 'NGN';
          if (needsConvert) {
            const converted = this.toNgn(item.cost);
            const clamped = Math.max(1500, Math.min(Math.ceil(Number(converted || 0)), 3000000));
            return { ...item, cost: clamped, ...(item as any).currency !== 'NGN' ? { currency: 'NGN' } : {} } as SmsService;
          }
          const clamped = Math.max(1500, Math.min(Math.ceil(Number(item.cost || 0)), 3000000));
          return { ...item, cost: clamped } as SmsService;
        });
        // Enrich suspicious low/zero prices using countries-by-service (best-effort, capped)
        mapped = await this.enrichServicePricesWithCatalog(mapped, countryParam, provider);
        if (mapped.length > 0) {
          // Cache real data for 1 hour
          this.writeLocalCache(cacheKey, mapped, 60 * 60 * 1000);
          return mapped;
        }
      } else if (Array.isArray(data)) {
        let mapped = (data as any[]).map(normalize).filter(Boolean) as SmsService[];
        mapped = mapped.map((item) => {
          const currency = (item as any).currency;
          const needsConvert = !currency || currency !== 'NGN';
          if (needsConvert) {
            const converted = this.toNgn(item.cost);
            const clamped = Math.max(1500, Math.min(Math.ceil(Number(converted || 0)), 3000000));
            return { ...item, cost: clamped, ...(item as any).currency !== 'NGN' ? { currency: 'NGN' } : {} } as SmsService;
          }
          const clamped = Math.max(1500, Math.min(Math.ceil(Number(item.cost || 0)), 3000000));
          return { ...item, cost: clamped } as SmsService;
        });
        mapped = await this.enrichServicePricesWithCatalog(mapped, countryParam, provider);
        if (mapped.length > 0) {
          this.writeLocalCache(cacheKey, mapped, 60 * 60 * 1000);
          return mapped;
        }
      }

      // Fallback
      console.warn('Backend returned no data, suppressing mock services');
      return [];
    } catch (error) {
      // Handle timeout errors specifically (quieter logging)
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('SMS API request timed out (provider/country may be slow). Returning empty list.');
        return [];
      }
      console.error('Error fetching services from Laravel:', error);
      
      if (provider) {
        const cached = this.readLocalCache<SmsService[]>(`sms:services:v${SmsApiService.CACHE_VERSION}:${provider}:${country}`);
        if (cached && Array.isArray(cached) && cached.length > 0) return cached;
        // No cached data, suppress mock services
        return [];
      }
      // Non-provider-specific fallback to mock
      return [];
    }
  }

  // Force refetch services and repopulate local cache for given country/provider
  async refreshServicesCache(country: string = 'US', provider?: string): Promise<SmsService[]> {
    try {
      const key = this.makeServicesCacheKey(country, provider);
      localStorage.removeItem(key);
    } catch {}
    return this.getServices(country, provider);
  }

  // Force refetch for all providers and return summary; useful for warming cache
  async refreshAllProvidersServicesCache(country: string = 'US'): Promise<{ provider: string; count: number }[]> {
    const providers = ['tiger_sms', '5sim', 'dassy', 'smspool', 'textverified'];
    const results = await Promise.all(providers.map(async (p) => {
      const services = await this.refreshServicesCache(country, p);
      return { provider: p, count: services.length };
    }));
    return results;
  }

  // Best-effort enrichment: for services with cost <= 1500, query countries-by-service and use NGN cost for the selected country if available
  private async enrichServicePricesWithCatalog(items: SmsService[], countryCode: string, provider?: string): Promise<SmsService[]> {
    try {
      const needsEnrich = items.filter((s) => !isFinite(s.cost) || s.cost <= 1500).slice(0, 12);
      if (needsEnrich.length === 0) return items;
      const updates = await Promise.all(needsEnrich.map(async (s) => {
        try {
          const rows = await this.getCountriesByService(s.service, provider);
          const hit = rows.find((r) => (r.country_id || '').toUpperCase() === (countryCode || '').toUpperCase());
          const cost = Number(hit?.cost ?? 0);
          return { key: s.service, cost: isFinite(cost) && cost > 0 ? Math.ceil(cost) : null };
        } catch {
          return { key: s.service, cost: null };
        }
      }));
      const priceMap = new Map<string, number>();
      updates.forEach(u => { if (u.cost && u.cost > 0) priceMap.set(u.key, u.cost); });
      if (priceMap.size === 0) return items;
      return items.map((s) => priceMap.has(s.service) ? { ...s, cost: Math.max(priceMap.get(s.service) as number, 1500) } : s);
    } catch {
      return items;
    }
  }

  /**
   * Auto failover: try multiple providers in order until services are returned
   */
  async getServicesAuto(country: string): Promise<SmsService[]> {
    const providerPriority = ['tiger_sms', '5sim', 'dassy', 'smspool', 'textverified'];
    for (const p of providerPriority) {
      try {
        const svcs = await this.getServices(country, p);
        if (Array.isArray(svcs) && svcs.length > 0) return svcs;
      } catch {
        // try next provider
      }
    }
    return [];
  }

  /**
   * Get available SMS services from all providers for a country (using cached data)
   */
  async getServicesFromAllProviders(country: string = ''): Promise<{ provider: string; services: SmsService[] }[]> {
    console.log(`🚀 Fetching services for country: ${country}`);
    
    // Use fallback method directly since cached endpoints are empty
    return this.getServicesFromAllProvidersFallback(country);
  }

  /**
   * Fallback method to get services directly from providers (original implementation)
   */
  private async getServicesFromAllProvidersFallback(country: string = ''): Promise<{ provider: string; services: SmsService[] }[]> {
    const providers = ['tiger_sms', '5sim', 'dassy', 'smspool', 'textverified'];
    
    console.log(`🔍 Fallback: Fetching services from all providers for country: ${country}`);
    
    // Fetch from all providers in parallel for speed
    const promises = providers.map(async (providerName) => {
      try {
        console.log(`📡 Trying ${providerName} for ${country}...`);
        const services = await this.getServices(country, providerName);
        console.log(`✅ ${providerName} returned ${services?.length || 0} services for ${country}`);
        
        if (services && services.length > 0) {
          // Update provider names with actual brand names
          const updatedServices = services.map(service => ({
            ...service,
            provider_name: this.getProviderDisplayName(providerName)
          }));
          return { provider: providerName, services: updatedServices };
        } else {
          console.log(`⚠️ ${providerName} returned no services for ${country}`);
          return { provider: providerName, services: [] };
        }
      } catch (error) {
        console.error(`❌ ${providerName} failed for ${country}:`, error);
        return { provider: providerName, services: [], error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });
    
    const allResults = await Promise.all(promises);
    
    // Log summary
    const successfulProviders = allResults.filter(result => result.services.length > 0);
    const failedProviders = allResults.filter(result => result.services.length === 0);
    
    console.log(`📊 Fallback summary for ${country}:`);
    console.log(`✅ Working providers: ${successfulProviders.map(p => p.provider).join(', ')}`);
    console.log(`❌ Failed providers: ${failedProviders.map(p => p.provider).join(', ')}`);
    
    // Return only providers with services, but include error info for debugging
    const result = allResults.filter(result => result.services.length > 0);
    
    if (result.length === 0) {
      console.warn(`🚨 No providers returned services for ${country}. This might indicate backend issues.`);
    }
    
    return result;
  }

  /**
   * Get available SMS servers (Manual Server Selection)
   */
  async getServers(): Promise<any[]> {
    try {
      const authToken = this.getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization header if we have a token
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${this.baseUrl}/servers`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Servers endpoint not found, using fallback data');
          return this.getFallbackServers();
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch servers`);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch servers');
      }
    } catch (error) {
      console.error('Error fetching servers:', error);
      // Return fallback data instead of throwing
      return this.getFallbackServers();
    }
  }

  private getFallbackServers(): any[] {
    return [
      {
        id: 1,
        name: "FADDED GLOBAL",
        display_name: "FADDED GLOBAL",
        provider: "tiger_sms",
        success_rate: 98.5,
        total_orders: 1250,
        successful_orders: 1188,
        status: "active",
        priority: 1,
        location: "Global",
        region: "Global",
        created_at: "2024-01-01T00:00:00.000000Z"
      },
      {
        id: 2,
        name: "FADDED SIM",
        display_name: "FADDED SIM",
        provider: "5sim",
        success_rate: 96.0,
        total_orders: 1040,
        successful_orders: 998,
        status: "active",
        priority: 2,
        location: "Global",
        region: "Global",
        created_at: "2024-01-01T00:00:00.000000Z"
      },
      {
        id: 3,
        name: "Dassy",
        display_name: "Dassy",
        provider: "dassy",
        success_rate: 94.0,
        total_orders: 800,
        successful_orders: 752,
        status: "active",
        priority: 3,
        location: "Global",
        region: "Global",
        created_at: "2024-01-01T00:00:00.000000Z"
      }
    ];
  }

  /**
   * Get available providers with success rates for manual selection
   */
  async getProviders(): Promise<SmsProvider[]> {
    try {
      // Use the getServices method to get providers
      const services = await this.getServices();
      
      // Transform services to providers format
      return services.map((service: any) => ({
        id: service.id || 1,
        name: service.name,
        provider: service.provider,
        success_rate: service.success_rate || 95,
        total_orders: 0,
        successful_orders: 0,
        balance: 0,
        last_balance_check: new Date().toISOString(),
        status: service.status || 'active',
        display_name: service.name
      }));
    } catch (error) {
      console.error('Error fetching providers:', error);
      // Return mock providers as fallback
      return MOCK_SMS_PROVIDERS;
    }
  }

  /**
   * Create a new SMS order with robust auto-selection fallback
   */
  async createOrder(country: string, service: string, mode: 'auto' | 'manual' = 'auto', provider?: string, userIdOverride?: number): Promise<SmsOrder> {
    // If mode is auto and no specific provider, try auto-selection with fallback
    if (mode === 'auto' && !provider) {
      return this.createOrderWithAutoFallback(country, service, userIdOverride);
    }
    
    // Original logic for manual mode or specific provider
    return this.createOrderDirect(country, service, mode, provider, userIdOverride);
  }

  /**
   * Create order with auto-selection fallback across multiple providers
   */
  private async createOrderWithAutoFallback(country: string, service: string, userIdOverride?: number): Promise<SmsOrder> {
    const providers = ['tiger_sms', '5sim', 'dassy', 'smspool', 'textverified'];
    const errors: string[] = [];

    for (const provider of providers) {
      try {
        console.log(`Trying provider: ${provider} for ${service} in ${country}`);
        const order = await this.createOrderDirect(country, service, 'manual', provider, userIdOverride);
        console.log(`Successfully created order with ${provider}:`, order.order_id);
        return order;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        const providerName = this.getProviderDisplayName(provider);
        
        // Handle specific error types
        if (error instanceof Error && error.message.includes('NO_NUMBERS')) {
          console.log(`Provider ${providerName}: No numbers available (will try next provider)`);
          errors.push('No numbers available');
        } else if (error instanceof Error && error.message.includes('COUNTRY_NOT_SUPPORTED')) {
          console.log(`Provider ${providerName}: Country not supported (will try next provider)`);
          errors.push('Country not supported');
        } else if (error instanceof Error && error.message.includes('NO_MONEY')) {
          console.warn(`Provider ${providerName}: Insufficient balance`);
          errors.push('Insufficient balance');
        } else {
          console.warn(`Provider ${providerName} failed:`, errorMsg);
          errors.push('Service unavailable');
        }
      }
    }

    // If all providers failed, throw a comprehensive error
    const noNumbersCount = errors.filter(e => e.includes('No numbers available')).length;
    const countryNotSupportedCount = errors.filter(e => e.includes('Country not supported')).length;
    const allProvidersCount = errors.length;
    
    if (noNumbersCount === allProvidersCount) {
      throw new Error('No numbers available for this service. Please try a different service or country.');
    } else if (countryNotSupportedCount === allProvidersCount) {
      throw new Error('This country is not supported. Please try a different country.');
    } else {
      throw new Error('All services are currently unavailable. Please try again later.');
    }
  }

  /**
   * Create a new SMS order directly with specified provider
   */
  private async createOrderDirect(country: string, service: string, mode: 'auto' | 'manual' = 'auto', provider?: string, userIdOverride?: number): Promise<SmsOrder> {
    try {
      const tokenUserId = this.getUserId();
      const effectiveUserId = userIdOverride ?? tokenUserId ?? null;

      // Normalize payload per provider rules before sending
      const body: SmsOrderPayload = normalizeOrderPayload({
        country,
        service,
        mode,
        provider: provider as any,
        user_id: effectiveUserId ?? undefined,
      });

      const response = await fetch(`${this.baseUrl}/sms/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let msg = `HTTP ${response.status}: Failed to create order`;
        try {
          const errJson = await response.json();
          if (errJson?.message) msg = errJson.message;
        } catch {}
        throw new Error(msg);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const orderData = {
          id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          order_id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          phone_number: data.data.phone_number || '',
          phone: data.data.phone_number || '',
          country: data.data.country || body.country,
          service: data.data.service || body.service,
          cost: Number(data.data.cost) || 0,
          amount: Number(data.data.cost) || 0,
          status: data.data.status || 'pending',
          expires_at: data.data.expires_at || new Date(Date.now() + 300000).toISOString(),
          provider: data.data.provider || (provider || 'Auto'),
          provider_name: data.data.provider_name || (provider || 'Auto'),
          mode: mode,
          success_rate: 95,
          currency: data.data.currency || 'NGN',
          reference: data.data.order_id?.toString() || `SMS${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Optional inbox message (guarded by feature flag)
        if (this.inboxEnabled) {
          try {
            await fetch(`${this.baseUrl}/inbox/messages`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`,
              },
              body: JSON.stringify({
                type: 'sms_order',
                title: '🔆 Fadded VIP SMS Order Created',
                message: `Your SMS order has been created successfully. Phone: ${orderData.phone_number}, Service: ${orderData.service}, Country: ${orderData.country}`,
                reference: orderData.reference,
                metadata: {
                  order_id: orderData.order_id,
                  phone_number: orderData.phone_number,
                  country: orderData.country,
                  service: orderData.service,
                  provider: orderData.provider_name,
                  cost: orderData.cost,
                  expires_at: orderData.expires_at,
                  mode: orderData.mode
                }
              }),
            });
          } catch (inboxError) {
            console.warn('Failed to create inbox message for SMS order:', inboxError);
          }
        }

        return orderData;
      } else if (data.status === 'success' && data.data) {
        const orderData = {
          id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          order_id: data.data.order_id?.toString() || `SMS${Date.now()}`,
          phone_number: data.data.phone_number || '',
          phone: data.data.phone_number || '',
          country: data.data.country || body.country,
          service: data.data.service || body.service,
          cost: Number(data.data.cost) || 0,
          amount: Number(data.data.cost) || 0,
          status: data.data.status || 'pending',
          expires_at: data.data.expires_at || new Date(Date.now() + 300000).toISOString(),
          provider: data.data.provider || (provider || 'Auto'),
          provider_name: data.data.provider_name || (provider || 'Auto'),
          mode: mode,
          success_rate: 95,
          currency: data.data.currency || 'NGN',
          reference: data.data.order_id?.toString() || `SMS${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Create inbox message for SMS order
        try {
          await fetch(`${this.baseUrl}/inbox/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.getAuthToken()}`,
            },
            body: JSON.stringify({
              type: 'sms_order',
              title: '🔆 Fadded VIP SMS Order Created',
              message: `Your SMS order has been created successfully. Phone: ${orderData.phone_number}, Service: ${orderData.service}, Country: ${orderData.country}`,
              reference: orderData.reference,
              metadata: {
                order_id: orderData.order_id,
                phone_number: orderData.phone_number,
                country: orderData.country,
                service: orderData.service,
                provider: orderData.provider_name,
                cost: orderData.cost,
                expires_at: orderData.expires_at,
                mode: orderData.mode
              }
            }),
          });
        } catch (inboxError) {
          console.warn('Failed to create inbox message for SMS order:', inboxError);
          // Don't throw error - inbox message is not critical
        }

        return orderData;
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Handle specific provider responses gracefully
      if (error instanceof Error) {
        if (error.message.includes('NO_NUMBERS')) {
          throw new Error('No numbers available for this service. Please try a different service or country.');
        } else if (error.message.includes('COUNTRY_NOT_SUPPORTED')) {
          throw new Error('This country is not supported. Please try a different country.');
        } else if (error.message.includes('NO_MONEY')) {
          throw new Error('Insufficient balance. Please try again later.');
        } else if (error.message.includes('TOO_MANY_ACTIVE_RENTALS')) {
          throw new Error('Too many active orders. Please try again later.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Get SMS code for an order
   */
  async getSmsCode(orderId: string): Promise<{ sms_code: string; status: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          user_id: this.getUserId(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to get SMS code`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const smsCode = data.data.sms_code || data.data.code || '';
        const status = data.data.status || 'pending';
        
        // Optional inbox message when SMS code is received (guarded by feature flag)
        if (this.inboxEnabled && smsCode && status === 'received') {
          try {
            await fetch(`${this.baseUrl}/inbox/messages`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`,
              },
              body: JSON.stringify({
                type: 'sms_code',
                title: '🔆 Fadded VIP SMS Code Received',
                message: `Your SMS code has been received! Code: ${smsCode}. Order ID: ${orderId}`,
                reference: `SMS_CODE_${orderId}`,
                metadata: {
                  order_id: orderId,
                  sms_code: smsCode,
                  status: status,
                  received_at: new Date().toISOString()
                }
              }),
            });
          } catch (inboxError) {
            console.warn('Failed to create inbox message for SMS code:', inboxError);
          }
        }
        
        return {
          sms_code: smsCode,
          status: status,
        };
      } else if (data.status === 'success' && data.data) {
        const smsCode = data.data.sms_code || data.data.code || '';
        const status = data.data.status || 'pending';
        
        if (this.inboxEnabled && smsCode && status === 'received') {
          try {
            await fetch(`${this.baseUrl}/inbox/messages`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`,
              },
              body: JSON.stringify({
                type: 'sms_code',
                title: '🔆 Fadded VIP SMS Code Received',
                message: `Your SMS code has been received! Code: ${smsCode}. Order ID: ${orderId}`,
                reference: `SMS_CODE_${orderId}`,
                metadata: {
                  order_id: orderId,
                  sms_code: smsCode,
                  status: status,
                  received_at: new Date().toISOString()
                }
              }),
            });
          } catch (inboxError) {
            console.warn('Failed to create inbox message for SMS code:', inboxError);
          }
        }
        
        return {
          sms_code: smsCode,
          status: status,
        };
      } else {
        throw new Error(data.message || 'Failed to get SMS code');
      }
    } catch (error) {
      console.error('Error getting SMS code:', error);
      throw error;
    }
  }

  /**
   * Cancel an SMS order
   */
  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to cancel order`);
      }

      const data = await response.json();
      
      if (data.success) {
        return {
          success: data.success,
          message: data.message,
        };
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling SMS order:', error);
      throw error;
    }
  }

  /**
   * Get user's SMS orders
   */
  async getOrders(status?: string, page: number = 1): Promise<SmsOrderHistory[]> {
    try {
      // Ensure page is a valid number and not too high
      const validPage = Math.max(1, Math.min(page, 100)); // Limit to 100 pages max
      
      const params = new URLSearchParams({ page: validPage.toString() });
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${this.baseUrl}/sms/orders?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch orders`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Handle paginated response structure
        const orders = data.data.data || data.data;
        
        return orders.map((order: any) => ({
          order_id: order.order_id?.toString() || order.id?.toString(),
          phone_number: order.phone_number || '',
          service: order.service_type || order.service,
          country: order.country || '',
          cost: parseFloat(order.amount) || 0,
          status: order.status || 'pending',
          status_label: order.status || 'pending',
          sms_code: order.sms_code || null,
          expires_at: order.expires_at || null,
          received_at: order.received_at || null,
          provider: order.provider || 'auto',
          created_at: order.created_at || new Date().toISOString(),
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching SMS orders:', error);
      throw error;
    }
  }

  /**
   * Get inbox (previous SMS requests) using existing orders endpoint
   */
  async getInbox(status?: string, limit: number = 20): Promise<SmsOrderHistory[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('limit', String(limit));

      const response = await fetch(`${this.baseUrl}/sms/orders?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch inbox`);
      const data = await response.json();

      if (data.success && data.data) {
        const orders = data.data as any[];
        return orders.map((order: any) => ({
          order_id: order.order_id?.toString() || order.id?.toString(),
          phone_number: order.phone_number || '',
          service: order.service || order.service_type,
          country: order.country || '',
          cost: parseFloat(order.cost ?? order.amount ?? 0),
          status: order.status || 'pending',
          status_label: order.status || 'pending',
          sms_code: order.sms_code || null,
          expires_at: order.expires_at || null,
          received_at: order.received_at || null,
          provider: order.provider || (order.metadata?.provider ?? 'tiger_sms'),
          created_at: order.created_at || new Date().toISOString(),
        }));
      }
      throw new Error(data.message || 'Failed to fetch inbox');
    } catch (e) {
      console.error('Error fetching inbox:', e);
      throw e;
    }
  }

  /**
   * Get SMS service statistics
   */
  async getStats(): Promise<SmsStats> {
    try {
      const response = await fetch(`${this.baseUrl}/sms/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch statistics`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching SMS statistics:', error);
      throw error;
    }
  }

  /**
   * Poll for SMS code with retry mechanism
   */
  async pollForSmsCode(orderId: string, maxAttempts: number = 30, interval: number = 2000): Promise<string> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;
          const response = await this.getSmsCode(orderId);

          if (response.sms_code) {
            resolve(response.sms_code);
            return;
          }

          if (attempts >= maxAttempts) {
            reject(new Error('SMS code not received within timeout period'));
            return;
          }

          // Continue polling
          setTimeout(poll, interval);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  /**
   * Get countries and NGN prices for a given service
   */
  async getCountriesByService(service: string, provider?: string): Promise<Array<{ country_id: string; country_name: string; cost: number; count: number; provider: string }>> {
    const params: any = { service };
    if (provider) params.provider = provider;
    const timeoutMs = provider === '5sim' ? 10000 : this.defaultTimeoutMs;
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/sms/countries-by-service?` + new URLSearchParams(params), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      }, Math.max(timeoutMs, this.defaultTimeoutMs));
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch countries by service`);
      const data = await response.json();
      if (data.success && data.data) {
        return data.data as Array<{ country_id: string; country_name: string; cost: number; count: number; provider: string }>;
      }
      throw new Error(data.message || 'Failed to fetch countries by service');
    } catch (e) {
      console.error('Error fetching countries by service:', e);
      if (provider) {
        const cached = this.readLocalCache<Array<{ country_id: string; country_name: string; cost: number; count: number; provider: string }>>(`sms:countriesByService:${provider}:${service}`);
        if (cached && Array.isArray(cached) && cached.length > 0) return cached;
        return [];
      }
      throw e;
    }
  }

  /**
   * Get services catalog (distinct services) with min NGN price and counts
   */
  async getServicesCatalog(search: string = '', limit: number = 100, offset: number = 0): Promise<{ items: SmsService[]; limit: number; offset: number; count: number; has_more: boolean; }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', String(limit));
    params.append('offset', String(offset));

    const response = await fetch(`${this.baseUrl}/sms/services/catalog?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch services catalog`);
    const data = await response.json();

    if (data.success && data.data) {
      const items: SmsService[] = (data.data.items || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        service: s.service,
        cost: Number(s.cost),
        count: Number(s.count ?? 1),
        provider: s.provider || 'auto',
        provider_name: s.provider_name || 'Best price',
        description: s.description,
        status: s.status || 'active',
        priority: s.priority || 1,
        success_rate: s.success_rate || 95,
      }));
      return {
        items,
        limit: Number(data.data.limit ?? limit),
        offset: Number(data.data.offset ?? offset),
        count: Number(data.data.count ?? items.length),
        has_more: Boolean(data.data.has_more),
      };
    }

    throw new Error(data.message || 'Failed to fetch services catalog');
  }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Get user ID from auth token
   */
  private getUserId(): number | null {
    try {
      const token = this.getAuthToken();
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      const candidate = payload.sub ?? payload.user_id ?? payload.id ?? payload.uid ?? null;
      return candidate != null ? Number(candidate) : null;
    } catch (error) {
      console.error('Error getting user ID from token:', error);
      return null;
    }
  }

  /**
   * Get country flag emoji
   */
  private getCountryFlag(countryCode: string): string {
    const flagMap: { [key: string]: string } = {
      'US': '🇺🇸', 'UK': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'AT': '🇦🇹', 'CH': '🇨🇭',
      'IE': '🇮🇪', 'PT': '🇵🇹', 'GR': '🇬🇷', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'LT': '🇱🇹', 'LV': '🇱🇻', 'EE': '🇪🇪', 'NZ': '🇳🇿', 'JP': '🇯🇵',
      'KR': '🇰🇷', 'CN': '🇨🇳', 'HK': '🇭🇰', 'TW': '🇹🇼', 'IL': '🇮🇱',
      'TR': '🇹🇷', 'SA': '🇸🇦', 'AE': '🇦🇪', 'QA': '🇶🇦', 'KW': '🇰🇼',
      'BH': '🇧🇭', 'OM': '🇴🇲', 'JO': '🇯🇴', 'LB': '🇱🇧', 'SY': '🇸🇾',
      'IQ': '🇮🇶', 'IR': '🇮🇷', 'AF': '🇦🇫', 'UZ': '🇺🇿', 'KZ': '🇰🇿',
      'KG': '🇰🇬', 'TJ': '🇹🇯', 'TM': '🇹🇲', 'AZ': '🇦🇿', 'GE': '🇬🇪',
      'AM': '🇦🇲', 'BY': '🇧🇾', 'MD': '🇲🇩', 'AL': '🇦🇱', 'MK': '🇲🇰',
      'RS': '🇷🇸', 'ME': '🇲🇪', 'BA': '🇧🇦', 'XK': '🇽🇰', 'NG': '🇳🇬'
    };
    return flagMap[countryCode] || '🌍';
  }
}

export const smsApiService = new SmsApiService();
export default SmsApiService;
