import { IStackTokens, Label, Stack, Toggle } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { PersonalizationContext } from "../../shared/providers/PersonalizationProvider";
import { LanguageName, LanguageNames } from "../../shared/consts/LanguageNames";
import { useTranslation } from "react-i18next";

export const LanguageSwitch: React.FC = () => {
  const context = useContext(PersonalizationContext);
  const [language, setLanguage] = useState<LanguageName>(context.languageName);
  const { t } = useTranslation(); 

  const switchLanguage = () => {
    language === LanguageNames.Polish ? 
      setLanguage(LanguageNames.English) : 
      setLanguage(LanguageNames.Polish)
  };

  useEffect(() => {
    context.switchLanguage(language);
  }, [language]);

  const stackTokens: IStackTokens = { childrenGap: 10 };

  return (
    <Stack tokens={stackTokens}>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>{t('language')}:</Label>
        <Label>Polski</Label>
        <Toggle 
          className='theme-toggle' 
          defaultChecked={language === LanguageNames.English} 
          onClick={switchLanguage} 
        />
        <Label>English</Label>
      </Stack>
    </Stack>
    );
};

export default LanguageSwitch;