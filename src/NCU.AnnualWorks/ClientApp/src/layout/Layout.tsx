import React from "react";
import Nav from "./Nav";
import Main from "./Main";
import Footer from "./Footer";
import { mergeStyles } from "@fluentui/merge-styles";

export const Layout: React.FC = (props) => {
  return (
    <div className={layoutStyles}>
      <Nav />
      <Main>{props.children}</Main>
      <Footer />
    </div>
  )
};

export default Layout;

//#region Styles

const layoutStyles = mergeStyles({
  margin: 0,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

//#endregion
