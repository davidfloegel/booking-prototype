import React from "react";
import styled, { css } from "styled-components";

import { isInPeak } from "../util";

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
  width: 80px;
  border-right: 1px solid #ddd;
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const TimeSlot = styled.div<any>`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  transition: all 0.15s ease;

  ${({ disabled, isBusy, isSelected }) => css`
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

    ${disabled &&
      css`
        color: #ddd;
      `};
  `};
`;

const PeakSign = styled.i`
  font-size: 8px;
  border: 1px solid #16a085;
  color: #16a085;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  day: string;
  time: number;
  isBusy: boolean;
  isSelected: boolean;
  price: number;
  peakPrice: number;
  onClickRow: (t: number, p: number) => void;
  disabled: boolean;
  debugMode: boolean;
}

const TimeRow: React.SFC<Props> = ({
  time,
  day,
  isBusy,
  isSelected,
  price,
  peakPrice,
  disabled,
  onClickRow,
  debugMode
}) => {
  const isPeak = isInPeak(day, time);
  const usePrice = isPeak ? peakPrice : price;
  return (
    <Row>
      <TimeCol>
        <span>
          {time}
          :00
        </span>
        {!isPeak && <PeakSign className="fa fa-percentage" />}
      </TimeCol>
      <TimeSlot
        isBusy={isBusy}
        disabled={disabled}
        isSelected={isSelected}
        onClick={() =>
          !debugMode && (isBusy || disabled) ? {} : onClickRow(time, usePrice)
        }
      >
        {isBusy ? "Busy" : `£${Number(usePrice).toFixed(2)}`}
      </TimeSlot>
    </Row>
  );
};

export default TimeRow;
