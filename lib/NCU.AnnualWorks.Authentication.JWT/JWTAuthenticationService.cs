using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NCU.AnnualWorks.Authentication.JWT.Core;
using NCU.AnnualWorks.Authentication.JWT.Core.Constants;
using NCU.AnnualWorks.Authentication.JWT.Core.Models;
using NCU.AnnualWorks.Authentication.JWT.Core.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NCU.AnnualWorks.Authentication.JWT
{
    public class JWTAuthenticationService : IJWTAuthenticationService
    {
        private readonly JWTAuthenticationOptions _options;
        private readonly ILogger _logger;
        public JWTAuthenticationService(IOptions<JWTAuthenticationOptions> options, ILogger<JWTAuthenticationService> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public CookieOptions GetTokenCookieOptions() =>
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(15),
                SameSite = SameSiteMode.Strict,
                Secure = true,
                HttpOnly = true,
                IsEssential = true
            };

        public CookieOptions GetAuthCookieOptions() =>
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(60),
                SameSite = SameSiteMode.Strict,
                Secure = true,
                HttpOnly = true,
                IsEssential = true
            };

        public CookieOptions GetUserCookieOptions() =>
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(60),
                SameSite = SameSiteMode.Strict,
                Secure = true,
                HttpOnly = false,
                IsEssential = true
            };

        public ClaimsIdentity GenerateClaimsIdentity(AuthClaims claims)
        {
            return new ClaimsIdentity(new[]
            {
                new Claim(nameof(claims.Id), claims.Id.ToString()),
                new Claim(nameof(claims.AccessType), claims.AccessType.ToString()),
                new Claim(nameof(claims.Token), claims.Token),
                new Claim(nameof(claims.TokenSecret), claims.TokenSecret)
            });
        }

        public ClaimsIdentity GenerateClaimsIdentity(UserClaims claims)
        {
            return new ClaimsIdentity(new[]
            {
                new Claim(nameof(claims.Id), claims.Id.ToString()),
                new Claim(nameof(claims.Name), claims.Name),
                new Claim(nameof(claims.Email), claims.Email),
                new Claim(nameof(claims.AvatarUrl), claims.AvatarUrl),
                new Claim(nameof(claims.AccessType), claims.AccessType.ToString()),
            });
        }

        public string GenerateJWS(ClaimsIdentity claimsIdentity)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_options.JWSSigningKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //TODO: Get issuer based on current host
                TokenType = TokenTypes.JWS,
                Issuer = _options.ClaimsIssuer,
                Subject = claimsIdentity,
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(60), //TODO: Shorten expiration time to 15 minutes at most with refreshing/sliding window
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateJWE(ClaimsIdentity claimsIdentity)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var signingKey = Encoding.ASCII.GetBytes(_options.JWESigningKey);
            var encryptionKey = Encoding.ASCII.GetBytes(_options.JWEEncryptionKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //TODO: Get issuer based on current host
                TokenType = TokenTypes.JWE,
                Issuer = _options.ClaimsIssuer,
                Subject = claimsIdentity,
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(60), //TODO: Shorten expiration time to 15 minutes at most with refreshing/sliding window
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(signingKey), SecurityAlgorithms.HmacSha512Signature),
                EncryptingCredentials = new EncryptingCredentials(new SymmetricSecurityKey(encryptionKey), SecurityAlgorithms.Aes256KW, SecurityAlgorithms.Aes256CbcHmacSha512)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public bool TryValidateJWS(string token, out JwtSecurityToken jwt)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_options.JWSSigningKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuers = new List<string>() { _options.ClaimsIssuer },
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                }, out SecurityToken validatedToken);

                jwt = (JwtSecurityToken)validatedToken;

                return true;
            }
            catch (Exception e)
            {
                _logger.LogWarning(e.Message);
                jwt = null;
                return false;
            }
        }

        public bool TryValidateJWE(string token, out JwtSecurityToken jwt)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var signingKey = Encoding.ASCII.GetBytes(_options.JWESigningKey);
                var decryptionKey = Encoding.ASCII.GetBytes(_options.JWEEncryptionKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    TokenDecryptionKey = new SymmetricSecurityKey(decryptionKey),
                    IssuerSigningKey = new SymmetricSecurityKey(signingKey),
                    ValidIssuers = new List<string>() { _options.ClaimsIssuer },
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                }, out SecurityToken validatedToken);

                jwt = (JwtSecurityToken)validatedToken;

                return true;
            }
            catch (Exception e)
            {
                _logger.LogWarning(e.Message);
                jwt = null;
                return false;
            }
        }
    }
}
