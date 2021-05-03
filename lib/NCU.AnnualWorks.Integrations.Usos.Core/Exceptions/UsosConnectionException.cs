using System;
using System.Runtime.Serialization;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Exceptions
{
    [Serializable]
    public class UsosConnectionException : Exception
    {
        public UsosConnectionException()
        {

        }

        public UsosConnectionException(string message) : base(message)
        {

        }

        public UsosConnectionException(string message, Exception inner) : base(message, inner)
        {

        }

        protected UsosConnectionException(SerializationInfo info, StreamingContext context) : base(info, context)
        {

        }
    }
}
