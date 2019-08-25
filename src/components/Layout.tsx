import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";

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
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    height: 30px;
  }
`;

const Left = styled.div`
  width: 75px;
  display: flex;
  align-items: center;
  font-size: 11px;
  cursor: pointer;
  i {
    margin-left: 5px;
  }
`;

const Right = styled(Left)`
  justify-content: flex-end;
`;

const BackLink = styled(Link)`
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  color: #576574;
  display: flex;
  font-size: 12px;
  text-decoration: none;
  align-items: center;
  text-transform: uppercase;

  i {
    color: #ff5e57;
    font-size: 15px;
    margin-right: 5px;
  }
`;

interface Props {
  children: any;
  enabled?: boolean;
  enableSetBusySlots?: any;
}

const Layout: React.SFC<any> = ({
  children,
  match,
  enableSetBusySlots,
  enabled,
  ...rest
}) => (
  <Container>
    <Heading>
      <Left>
        {match.path === "/selection/:option" && (
          <BackLink to="/">
            <i className="fa fa-chevron-left" /> Back
          </BackLink>
        )}
      </Left>
      <img alt="logo" src="/logo.svg" />
      {enableSetBusySlots ? (
        <Right onClick={() => enableSetBusySlots()}>
          {enabled ? "Done" : "Set Fake Busy Slots"}
          <i className={`fa ${enabled ? "fa-check" : "fa-cog"}`} />
        </Right>
      ) : (
        <Left />
      )}
    </Heading>

    {children}
  </Container>
);

export default withRouter(Layout);
