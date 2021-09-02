﻿using MailKit.Net.Smtp;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using NCU.AnnualWorks.Integrations.Email.Core;
using NCU.AnnualWorks.Integrations.Email.Core.Models;
using NCU.AnnualWorks.Integrations.Email.Core.Options;
using System;
using System.Threading.Tasks;

namespace NCU.AnnualWorks.Integrations.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailServiceOptions _options;
        private readonly ILogger _logger;
        public EmailService(IOptions<EmailServiceOptions> options, ILogger<EmailService> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        private async Task SendEmail(MimeMessage message)
        {
            if (_options.ServiceDisabled)
            {
                return;
            }

            if (_options.DebugMode)
            {
                message.To.Clear();
                message.To.Add(MailboxAddress.Parse(_options.DebugEmail));
            }

            try
            {
                using (var client = new SmtpClient())
                {
                    client.LocalDomain = _options.Domain;
                    await client.ConnectAsync(_options.Host, _options.Port, useSsl: true);
                    await client.AuthenticateAsync(_options.Login, _options.Password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to send email message to {message.To}. Reason: {e.Message} Message: {message.Body}");
            }
        }

        public async Task SendEmailGradeConflict(GradeConflictEmailModel model)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(_options.Email));
                message.To.Add(MailboxAddress.Parse(model.Email));
                message.Subject = "Prace roczne - Konflikt ocen pracy";
                message.Body = new TextPart("plain")
                {
                    Text = $"Pojawił się konflikt ocen na promowanej przez Ciebie pracy pt. \"{model.ThesisTitle}\".\n" +
                    $"Skontaktuj się z recenzentem pracy i wspólnie ustalcie ocenę końcową.\n" +
                    $"Następnie przejdź do systemu i za pomocą akcji \"Wystaw ocenę\" zatwierdź ocenę końcową dla studenta.\n\n" +
                    $"Ten e-mail został wygenerowany automatycznie."
                };

                await SendEmail(message);
            }
            catch (Exception e)
            {
                _logger.LogError($"Failed to send email message to {model.Email}, UserId: {model.UserId}. Reason: {e.Message}");
            }
        }
    }
}
