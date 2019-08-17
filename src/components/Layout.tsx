import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  max-width: 400px;
`;

const Heading = styled.div`
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.25);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 30px;
  }
`;

interface Props {
  children: any;
}

const Layout: React.SFC<Props> = ({ children }) => (
  <Container>
    <Heading>
      <img src="/logo.svg" />
    </Heading>

    {children}
  </Container>
);

export default Layout;
