import React from "react";
import Nav from "../components/nav/nav";
import Main from "../components/main/main";
import Footer from "../components/footer/footer";
import { mergeStyles } from "@fluentui/merge-styles";

export const Layout: React.FC = (props) => {
  const layoutStyles = mergeStyles({
    margin: 0,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  })
  
  return (
    <div className={layoutStyles}>
      <Nav />
      <Main>{props.children}</Main>
      <Footer />
    </div>
  )
};

export default Layout;
