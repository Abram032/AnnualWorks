import React from "react";
import Nav from "../components/nav/nav";
import Main from "../components/main/main";
import Footer from "../components/footer/footer";

export const Layout: React.FC = (props) => (
  <div className="layout">
    <Nav />
    <Main>{props.children}</Main>
    <Footer />
  </div>
);

export default Layout;
