using System.Collections.Generic;

namespace NCU.AnnualWorks.Integrations.Usos.Core.Extensions
{
    public static class UsosUtils
    {
        //TODO: Simplify to single method
        public static string ToScopes(this IEnumerable<string> scopes) => string.Join('|', scopes);
        public static string ToFields(this IEnumerable<string> fields) => string.Join('|', fields);
    }
}
