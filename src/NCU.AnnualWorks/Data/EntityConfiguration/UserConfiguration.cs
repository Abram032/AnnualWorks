﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NCU.AnnualWorks.Core.Models.DbModels;

namespace NCU.AnnualWorks.Data.EntityConfiguration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);
            builder.HasAlternateKey(u => u.UsosId);

            builder.Property(p => p.UsosId).IsRequired().HasMaxLength(20);
            builder.Property(p => p.AccessType).IsRequired();

            builder.Property(p => p.FirstLoginAt);
            builder.Property(p => p.LastLoginAt);
        }
    }
}