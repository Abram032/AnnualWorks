import React from "react";
import Nav from "../components/navigation/Nav";
import Main from "../components/main/Main";
import Footer from "../components/footer/Footer";

export const Layout: React.FC = (props) => (
  <div className="layout">
    <Nav />
    <Main>{props.children}</Main>
    <Footer />
  </div>
);

export default Layout;
