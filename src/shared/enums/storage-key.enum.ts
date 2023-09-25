const STORAGE_KEY_PREFIX = 'audio_ecommerce_2023';

export enum StorageKey {
  TokenCachePass = 'token_cache_pass',
  TokenCacheAnonym = 'token_cache_anonym',
}

// Prefix Storage keys
Object.entries(StorageKey).forEach(([key, value]) => {
  Object.assign(StorageKey, { [key]: `${STORAGE_KEY_PREFIX}_${value}` });
});
