import React from "react";
import { Label, Stack, FontSizes, IStackTokens, mergeStyles, Link } from "@fluentui/react";

export const Privacy: React.FC = () => {
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item tokens={stackTokens}>
        <Label className={sectionTitle}>1. Pliki cookie</Label>
        <p className={sectionText}>
          Pliki cookie są to niewielkie pliki umieszczane na urządzeniu końcowym użytkownika. Pozwalają one na korzystanie z systemu zarządzania pracami rocznymi. Każda przeglądarka, za pomocą której użytkownik odwiedza stronę, otrzyma pliki cookie. Pliki cookie mogą również zostać umieszczone w przeglądarce przez strony trzecie. W tym przypadku może być to system USOS oraz witryny UMK.
        </p>
        <p className={sectionText}>
          Wykorzystywane są dwa typy plików cookie: trwałe oraz krótkotrwałe na czas sesji. Trwałe pliki są ważne przez czas znacznie dłuższy niż bieżąca sesja i służą głównie do rozpoznawania ponownie odwiedzającego użytkownika. Taki plik jest zapisywany w przeglądarce użytkownika i zostanie on odczytany przy każdej następnej wizycie. Pliki krótkotrwałe są ważne tylko przez czas trwania sesji. Po upłynięciu ich ważności są one usuwane z przeglądarki użytkownika.
        </p>
      </Stack.Item>
      <Stack.Item tokens={stackTokens}>
        <Label className={sectionTitle}>2. Do czego wykorzystywane są pliki cookie?</Label>
        <ol>
          <li>
            <p className={sectionText}>
              Uwierzytelnianie
            </p>
            <p className={sectionText}>
               Te pliki służą głównie do rozpoznawania użytkownika korzystającego z systemu. Jeśli użytkownik jest zalogowany, pliki pozwalają na prezentowanie użytkownikowi właściwych informacji na temat jego osoby, oraz zezwalają na dostęp do odpowiednich zasobów systemu, zależnie od jego uprawnień.
            </p>
          </li>
          <li>
            <p className={sectionText}>
              Bezpieczeństwo
            </p>
            <p className={sectionText}>
              Pozwalają na zwiększenie bezpieczeństwa podczas interakcji użytkownika z systemem.
            </p>
          </li>
          <li>
            <p className={sectionText}>
              Personalizacja
            </p>
            <p className={sectionText}>
              Pozwalają na zapamiętywanie ustawień użytkownika w systemie.
            </p>
          </li>
        </ol>
      </Stack.Item>
      <Stack.Item tokens={stackTokens}>
        <Label className={sectionTitle}>3. Polityka ochrony prywatności</Label>
        <ol>
          <li> 
            <p className={sectionText}>
              Jakie dane są gromadzone?
            </p>
            <p className={sectionText}>
              System nie gromadzi żadnych danych osobowych użytkownika. Wszelkie dane, które pojawiają się w systemie są pobierane z systemu USOS za zgodą użytkownika, zgodnie ze zdefiniowanymi przez niego preferencjami. Dane pobierane są również w kontekście samego użytkownika. Oznacza to, że dany użytkownik może zobaczyć informacje na temat innych użytkowników lub nie, zależnie od dostępów w systemie USOS. Jedynymi informacjami gromadzonymi w systemie są identyfikatory użytkowników z systemu USOS oraz pliki z pracami studentów.
            </p>
          </li>
          <li>
            <p className={sectionText}>
              Do czego dane są wykorzystywane?
            </p>
            <p className={sectionText}>
              Dane są wykorzystywane wyłącznie w celach autoryzacji dostępu użytkownika do systemu oraz do wyświetlania odpowiednich informacji, aby umożliwić korzystanie z aplikacji.
            </p>
          </li>
          <li>
            <p className={sectionText}>
              Czy mogę zrezygnować ze zgody na wykorzystywanie danych z systemu USOS?
            </p>
            <p className={sectionText}>
              Oczywiście, zgodę można anulować w dowolnym momencie. Aby to zrobić, należy przejść na stronę <Link href="https://usosapps.umk.pl/apps/">https://usosapps.umk.pl/apps/</Link>, a następnie zalogować się. Po zalogowaniu należy wybrać z listy "Prace roczne psychologia PROD". W opisie pojawi się informacja na temat obecnych zgód oraz opcja rezygnacji z nich.
            </p>
          </li>
        </ol>
      </Stack.Item>
      <Stack.Item tokens={stackTokens}>
        <Label className={sectionTitle}>4. Inne ważne informacje</Label>
        <p className={sectionText}>
          Do systemu zostały wprowadzone zabepieczenia mające na celu dodatkową ochronę danych użytkownika, takie jak np. szyfrowanie ruchu za pomocą protokołu HTTPS. Pliki cookies zostały również odpowiednio zabezpieczone, aby uniemożliwić przeglądarce dostęp do nich. Niektóre z nich są dodatkowo zaszyfrowane oraz podpisane kluczem kryptograficznym dla zwiększenia bezpieczeństwa. Logowanie do systemu odbywa się z wykorzystaniem standardu OAuth, z którego korzysta centralny punkt logowania UMK. Nie ma jednak gwarancji bezpieczeństwa informacji wysyłanych przez użytkownika. Nie ma również gwarancji, że dane nie zostaną pozyskane, ujawnione bądź zmodyfikowane w wyniku naruszenia zabezpieczeń infrastruktury systemu.
        </p>
      </Stack.Item>
    </Stack>
  );
};

export default Privacy;

//#region Styles

const sectionTitle = mergeStyles({ fontSize: FontSizes.size24 });
const sectionText = mergeStyles({ fontSize: FontSizes.size16 });

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion