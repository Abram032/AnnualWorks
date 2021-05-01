using System;
using System.Runtime.Serialization;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Exceptions
{
    [Serializable]
    public class UsosUnauthorizedException : Exception
    {
        public UsosUnauthorizedException()
        {
        }

        public UsosUnauthorizedException(string message) : base(message)
        {
        }

        public UsosUnauthorizedException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected UsosUnauthorizedException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}