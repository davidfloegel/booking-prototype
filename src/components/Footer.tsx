import React from "react";
import styled, { css } from "styled-components";
import CountUp from "react-countup";

const FooterDiv = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
  padding: 0 10px;
`;

const Total = styled.div`
  flex: 1;
`;

const Price = styled.div`
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 2px;
`;
const TotalLabel = styled.div`
  font-size: 12px;
  color: #666;
`;

const ConfirmButton = styled.button<any>`
  font-size: 16px;
  padding: 15px 25px;
  border: none;
  background: #222f3e;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  outline: none;

  ${({ disabled }) =>
    disabled &&
    css`
      background: #eee;
      color: #ccc;
    `};
`;

interface Props {
  total: number;
  onConfirm: any;
  isValid: boolean;
  noAnimation?: boolean;
}

const Footer: React.SFC<Props> = ({
  total,
  onConfirm,
  isValid,
  noAnimation
}) => (
  <FooterDiv>
    <Total>
      <Price>
        {noAnimation ? (
          `£${Number(total).toFixed(2)}`
        ) : (
          <CountUp
            duration={0.25}
            prefix="£"
            decimals={2}
            decimal="."
            end={total}
          />
        )}
      </Price>
      <TotalLabel>Total Price</TotalLabel>
    </Total>
    <ConfirmButton onClick={onConfirm} disabled={!isValid}>
      Next
    </ConfirmButton>
  </FooterDiv>
);

export default Footer;
