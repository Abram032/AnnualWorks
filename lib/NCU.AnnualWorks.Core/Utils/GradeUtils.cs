using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace NCU.AnnualWorks.Core.Utils
{
    public static class GradeUtils
    {
        public static bool TryGetAverageGrade(IEnumerable<string> grades, out string average)
        {
            var averageGrade = Math.Round(grades.Select(g => double.Parse(g, CultureInfo.InvariantCulture)).Average(), 2);
            var averageString = averageGrade.ToString("0.0", CultureInfo.InvariantCulture);
            if (averageString.EndsWith(".0"))
            {
                average = averageString.Replace(".0", "");
            }
            else if (averageString.EndsWith(".5"))
            {
                average = averageString;
            }
            else
            {
                average = averageGrade.ToString("0.00", CultureInfo.InvariantCulture);
            }
            var regex = new Regex(@"(^2$)|(^3$)|(^3\.5$)|(^4$)|(^4\.5$)|(^5$)");
            if (regex.IsMatch(average))
            {
                return true;
            }
            return false;
        }
    }
}
