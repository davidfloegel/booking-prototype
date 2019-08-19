import React from "react";
import styled, { css } from "styled-components";

const OfferWrapper = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
`;

const Heading = styled.div`
  display: flex;
`;
const Title = styled.div`
  font-size: 18px;
  flex: 1;
`;
const Price = styled.div`
  font-size: 18px;
  font-weight: bold;

  small {
    font-size: 12px;
  }
`;

const Description = styled.div`
  font-size: 12px;
  color: #aaa;
`;

interface Props {}

const Offers: React.SFC<Props> = () => (
  <OfferWrapper>
    <Heading>
      <Title>Solo Practice</Title>
      <Price>
        <small>from</small> £6.50 p/h
      </Price>
    </Heading>
    <Description>Available Mon - Fri (11am - 5pm)</Description>
  </OfferWrapper>
);

export default Offers;
