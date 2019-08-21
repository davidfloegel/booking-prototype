import React from "react";
import styled from "styled-components";

import Layout from "./components/Layout";

import Offer from "./components/Offers";

import { bookingOptions } from "./data";

const OffersWrapper = styled.div`
  padding: 15px 10px;
`;

const Offers: React.SFC<any> = ({ history }) => (
  <Layout>
    <OffersWrapper>
      {bookingOptions.map(o => (
        <Offer key={o.id} option={o} history={history} />
      ))}
    </OffersWrapper>
  </Layout>
);

export default Offers;
