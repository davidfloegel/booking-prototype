import React from "react";
import styled, { css } from "styled-components";

import { getPriceForTime } from "../util";

const Header = styled.div`
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
`;

const Row = styled(Header)`
  &:last-of-type {
    border-bottom: none;
  }
`;

const TimeCol = styled.div`
  height: 40px;
  width: 70px;
  border-right: 1px solid #ddd;
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: center;
`;

const TimeSlot = styled.div<any>`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  transition: background 0.15s ease;

  ${({ isBusy, isSelected }) => css`
    ${!isBusy &&
      css`
        &:hover {
          cursor: pointer;
        }
      `};

    ${isBusy &&
      css`
        background: #eee;
        font-size: 12px;
        color: #ddd;
      `};

    ${isSelected &&
      css`
        background: #1dd19f;
        color: #fff;
      `};
  `};
`;

interface Props {
  time: number;
  isBusy: boolean;
  isSelected: boolean;
  onClickRow: (t: number, p: number) => void;
}

const TimeRow: React.SFC<Props> = ({
  time,
  isBusy,
  isSelected,
  onClickRow
}) => (
  <Row key={time}>
    <TimeCol>
      {time}
      :00
    </TimeCol>
    <TimeSlot
      isBusy={isBusy}
      isSelected={isSelected}
      onClick={() => (isBusy ? {} : onClickRow(time, getPriceForTime(time)))}
    >
      {isBusy ? "Busy" : `£${Number(getPriceForTime(time)).toFixed(2)}`}
    </TimeSlot>
  </Row>
);

export default TimeRow;
