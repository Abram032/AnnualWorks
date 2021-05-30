using System;
using System.Runtime.Serialization;

namespace NCU.AnnualWorks.Core.Exceptions
{
    [Serializable]
    public class InvalidDeadlineException : Exception
    {
        public InvalidDeadlineException()
        {

        }

        public InvalidDeadlineException(string message) : base(message)
        {

        }

        public InvalidDeadlineException(string message, Exception inner) : base(message, inner)
        {

        }

        protected InvalidDeadlineException(SerializationInfo info, StreamingContext context) : base(info, context)
        {

        }
    }
}
