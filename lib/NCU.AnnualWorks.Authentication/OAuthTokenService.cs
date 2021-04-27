using Microsoft.Extensions.Caching.Memory;
using NCU.AnnualWorks.Authentication.Core.Abstractions;
using System;

namespace NCU.AnnualWorks.Authentication
{
    public class OAuthTokenService : IOAuthTokenService
    {
        private readonly IMemoryCache _cache;
        public OAuthTokenService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string Get(string key)
        {
            if (_cache.TryGetValue<string>(key, out var value))
            {
                return value;
            }

            return null;
        }

        public void Remove(string key) => _cache.Remove(key);

        public void SetRequestToken(string key, string value)
        {
            _cache.Set(key, value, new MemoryCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            });
        }

        public void SetAccessToken(string key, string value)
        {
            _cache.Set(key, value, new MemoryCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(90)
            });
        }
    }
}
