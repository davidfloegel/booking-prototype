import React from "react";
import styled from "styled-components";

import Layout from "./components/Layout";

import Offer from "./components/Offers";

const OffersWrapper = styled.div`
  padding: 15px 10px;
`;

const Offers: React.SFC<any> = () => (
  <Layout>
    <OffersWrapper>
      <Offer />
      <Offer />
      <Offer />
    </OffersWrapper>
  </Layout>
);

export default Offers;
