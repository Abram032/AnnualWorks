import { Dropdown, Icon, IDropdownOption, IStackTokens, Label, mergeStyles, Stack, Toggle } from "@fluentui/react";
import React, { useContext, useEffect, useState } from "react";
import { PersonalizationContext } from "../../shared/providers/PersonalizationProvider";
import { LanguageName, LanguageNames } from "../../shared/Consts";
import { useTranslation } from "react-i18next";

interface LanguagePickerProps {
  useDropdown?: boolean;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = (props) => {
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

  
  if(props.useDropdown) {
    return (
      <Stack horizontal verticalAlign='center' tokens={stackTokens}>
        <Icon iconName='Globe' />
        <Dropdown 
          selectedKey={context.languageName}
          options={dropdownOptions}
          onChange={(event, item) => {
            const lang = item as IDropdownOption<LanguageName>;
            setLanguage(lang.data!);
          }}
        />
      </Stack>
    );
  }

  return (
    <Stack tokens={stackTokens}>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Label>{t('language')}:</Label>
        <Label>Polski</Label>
        <Toggle 
          className={toggleStyles}
          defaultChecked={language === LanguageNames.English} 
          onClick={switchLanguage} 
        />
        <Label>English</Label>
      </Stack>
    </Stack>
    );
};

export default LanguagePicker;


//#region Language options

const dropdownOptions: IDropdownOption<LanguageName>[] = [
  {
    key: LanguageNames.Polish,
    text: 'Polski',
    data: LanguageNames.Polish
  },
  {
    key: LanguageNames.English,
    text: 'English',
    data: LanguageNames.English,
  }
];

//#endregion

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 10 };

const toggleStyles = mergeStyles({
  margin: 0
});

//#endregion