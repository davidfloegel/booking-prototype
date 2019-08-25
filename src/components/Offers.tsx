import React, { useState } from "react";
import styled from "styled-components";

const OfferWrapper = styled.div`
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  padding: 15px 0;
`;

const Heading = styled.div`
  display: flex;
`;
const Title = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
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
  margin-bottom: 5px;
`;

const Trigger = styled.div`
  color: #3c40c6;
  font-size: 12px;
`;

const Rules = styled.div`
  font-size: 12px;
  color: #aaa;
`;

interface Props {}

const Offers: React.SFC<any> = ({ history, option }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <OfferWrapper>
      <Heading onClick={() => history.push(`/selection/${option.id}`)}>
        <Title>{option.title}</Title>
        <Price>
          <small>from</small> £{Number(option.price).toFixed(2)} p/h
        </Price>
      </Heading>
      <Description>
        Available {option.availableDays[0]} -{" "}
        {option.availableDays[option.availableDays.length - 1]}
      </Description>
      <Trigger onClick={e => setShowDetails(!showDetails)}>
        {showDetails ? "Hide" : "Details"}
      </Trigger>
      {showDetails && <Rules>{option.description}</Rules>}
    </OfferWrapper>
  );
};

export default Offers;
