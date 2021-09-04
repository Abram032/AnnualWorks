import React from "react";
import { Label, Stack, FontSizes, IStackTokens, mergeStyles, useTheme, Image } from "@fluentui/react";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Link } from "../Components";
import { CardBody, CardFooter, CardFooterIcons } from "../components/Index";

export const About: React.FC = () => {
  const theme = useTheme();

  //#region Styles

  const iconLink = mergeStyles({ 
    color: theme.palette.neutralPrimary
  });
  
  const stackTokens: IStackTokens = { childrenGap: 15 };

  const regularFontStyle = mergeStyles({ fontSize: FontSizes.size18 });

  const largeFontStyle = mergeStyles({ fontSize: FontSizes.size24 });

  //#endregion Styles

  //#region Icons

  const repo = <Link href="https://github.com/Abram032/AnnualWorks">GitHub</Link>

  //#endregion Icons

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label className={largeFontStyle}>O stronie</Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label className={regularFontStyle}>System powstał w ramach pracy magisterskiej. Promotorami pracy są Prof. Jacek Matulewski oraz Prof. Maciej Trojan.</Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label className={regularFontStyle}>
          Kod źródłowy jest w pełni otwarty i dostępny w repozytorium {repo}. 
        </Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Label className={largeFontStyle}>Autor</Label>
      </Stack.Item>
      <Stack.Item align="center" tokens={stackTokens}>
        <Card>
          <CardBody>
            <Image 
              src={`${process.env.PUBLIC_URL}/images/avatar.png`} 
              width={200} 
              height={200} 
            />
          </CardBody>
          <CardFooter>
            <Label style={{fontSize: FontSizes.size18}}>Adam Błaszczyk</Label>
          </CardFooter>
          <CardFooterIcons>
            <Link href="https://github.com/Abram032/"><FontAwesomeIcon icon={faGithub} size="2x"/></Link>
            <Link href="https://www.linkedin.com/in/adam-blaszczyk-d34gf87"><FontAwesomeIcon icon={faLinkedin} size="2x"/></Link>
          </CardFooterIcons>
        </Card>
      </Stack.Item>
    </Stack>
  );
};

export default About;