<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class RefreshSmsCatalog extends Command
{
    protected $signature = 'sms:refresh-catalog {--provider=* : Limit to specific providers}';
    protected $description = 'Refresh SMS services/countries/prices catalog from providers via internal API';

    public function handle(): int
    {
        $baseUrl = config('app.url');
        if (!$baseUrl) {
            $this->error('APP_URL not set');
            return self::FAILURE;
        }
        $http = Http::timeout(45);

        // Providers to process
        $providers = DB::table('sms_services')->where('is_active', 1)->pluck('provider')->unique()->values()->all();
        if (empty($providers)) {
            $providers = ['tiger_sms', '5sim', 'textverified', 'dassy'];
        }
        $limitProviders = (array)$this->option('provider');
        if (!empty($limitProviders)) {
            $providers = array_values(array_intersect($providers, $limitProviders));
        }

        foreach ($providers as $provider) {
            $this->info("Processing provider: {$provider}");

            // Fetch countries
            $countriesResp = $http->get(rtrim($baseUrl, '/') . '/sms/countries', ['provider' => $provider]);
            $countries = [];
            if ($countriesResp->ok()) {
                $countries = $countriesResp->json('data') ?? [];
                $countryRows = [];
                foreach ($countries as $c) {
                    $code = $c['code'] ?? ($c['id'] ?? null);
                    $name = $c['name'] ?? ($c['country_name'] ?? '');
                    if (!$code || !$name) continue;
                    $countryRows[] = [
                        'provider' => $provider,
                        'country_code' => (string)$code,
                        'country_name' => (string)$name,
                        'updated_at' => now(),
                        'created_at' => now(),
                    ];
                }
                if (!empty($countryRows)) {
                    DB::table('sms_country_catalog')->upsert($countryRows, ['provider', 'country_code'], ['country_name', 'updated_at']);
                }
            }

            // Decide country list per provider
            $countryCodes = array_values(array_unique(array_map(fn($c) => (string)($c['code'] ?? $c['id'] ?? ''), $countries)));
            if ($provider === 'textverified') {
                $countryCodes = ['US'];
            }
            if (empty($countryCodes)) {
                $countryCodes = ['19']; // fallback (NG) for tiger/5sim
            }

            // Aggregate services across countries
            $serviceKeyToRow = [];
            foreach ($countryCodes as $cc) {
                $servicesResp = $http->post(rtrim($baseUrl, '/') . '/sms/services', [
                    'country' => $cc,
                    'provider' => $provider,
                ]);
                if (!$servicesResp->ok()) continue;
                $services = $servicesResp->json('data') ?? [];
                foreach ($services as $s) {
                    $serviceKey = (string)($s['service'] ?? $s['name'] ?? '');
                    $name = (string)($s['name'] ?? $serviceKey);
                    if ($serviceKey === '') continue;
                    if (!isset($serviceKeyToRow[$serviceKey])) {
                        $serviceKeyToRow[$serviceKey] = [
                            'provider' => $provider,
                            'service' => $serviceKey,
                            'name' => $name,
                            'description' => (string)($s['description'] ?? ''),
                            'capability' => (string)($s['capability'] ?? ''),
                            'currency' => 'NGN',
                            'min_cost' => null,
                            'max_cost' => null,
                            'avg_cost' => null,
                            'samples' => 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
            }

            // For each service, fetch countries-by-service to fill prices
            $priceRows = [];
            foreach (array_keys($serviceKeyToRow) as $serviceKey) {
                $cbsResp = $http->get(rtrim($baseUrl, '/') . '/sms/countries-by-service', [
                    'service' => $serviceKey,
                    'provider' => $provider,
                ]);
                if (!$cbsResp->ok()) continue;
                $rows = $cbsResp->json('data') ?? [];
                $costs = [];
                foreach ($rows as $r) {
                    $code = (string)($r['country_id'] ?? $r['country'] ?? '');
                    $cost = (float)($r['cost'] ?? 0);
                    $count = (int)($r['count'] ?? 0);
                    if ($code === '') continue;
                    $priceRows[] = [
                        'provider' => $provider,
                        'service' => $serviceKey,
                        'country_code' => $code,
                        'cost' => $cost,
                        'count' => $count,
                        'last_seen_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    if ($cost > 0) $costs[] = $cost;
                }
                if (!empty($costs)) {
                    $serviceKeyToRow[$serviceKey]['min_cost'] = min($costs);
                    $serviceKeyToRow[$serviceKey]['max_cost'] = max($costs);
                    $serviceKeyToRow[$serviceKey]['avg_cost'] = array_sum($costs) / max(1, count($costs));
                    $serviceKeyToRow[$serviceKey]['samples'] = count($costs);
                    $serviceKeyToRow[$serviceKey]['updated_at'] = now();
                }
            }

            if (!empty($serviceKeyToRow)) {
                DB::table('sms_service_catalog')->upsert(array_values($serviceKeyToRow), ['provider', 'service'], ['name', 'description', 'capability', 'min_cost', 'max_cost', 'avg_cost', 'samples', 'updated_at']);
            }
            if (!empty($priceRows)) {
                DB::table('sms_service_country_prices')->upsert($priceRows, ['provider', 'service', 'country_code'], ['cost', 'count', 'last_seen_at', 'updated_at']);
            }

            $this->info("Provider {$provider} done. Services: " . count($serviceKeyToRow) . ", Prices: " . count($priceRows));
        }

        $this->info('SMS catalog refresh completed');
        return self::SUCCESS;
    }
}
