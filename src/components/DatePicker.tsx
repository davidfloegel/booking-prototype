import React from "react";
import styled, { css } from "styled-components";
import * as dateFns from "date-fns";

const Picker = styled.div`
  background: #f9f9f9;
  padding: 0 0 10px 0;
 border-bottom: 1px solid #ddd;
position: sticky;
top: 0;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;

const ArrowBtn = styled.button`
  width: 40px;
  height: 40px;
  outline: none;
`;

const CurrentDay = styled.div`
  font-size: 16px;
`;

const DaysRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`;

const Day = styled.button<any>`
  width: 35px;
  height: 35px;
  border-radius: 100%;
  border: none;
  background: none;
  outline: none;

  ${({ active }) =>
    active &&
    css`
      border: 1px solid #ff5e57;
      color: #ff5e57;
    `};
`;

interface Props {
  base: Date; // just for prototype
  current: Date;
  onNavigate: (d: Date) => void;
}

const genDays = (base: Date) => {
  return [
    dateFns.subDays(base, 2),
    dateFns.subDays(base, 1),
    base,
    dateFns.addDays(base, 1),
    dateFns.addDays(base, 2),
    dateFns.addDays(base, 3),
    dateFns.addDays(base, 4)
  ];
};

const DatePicker: React.SFC<Props> = ({ base, current, onNavigate }) => (
  <Picker>
    <Top>
      <ArrowBtn
        onClick={() => {
          const yesterday = dateFns.subDays(current, 1);
          const min = dateFns.subDays(base, 3);

          if (!dateFns.isBefore(yesterday, min)) {
            onNavigate(yesterday);
          }
        }}
      >
        <i className="fa fa-chevron-left" />
      </ArrowBtn>
      <CurrentDay>{dateFns.format(current, "dddd, DD MMMM YYYY")}</CurrentDay>
      <ArrowBtn
        onClick={() => {
          const tomorrow = dateFns.addDays(current, 1);
          const max = dateFns.addDays(base, 4);

          if (!dateFns.isAfter(tomorrow, max)) {
            onNavigate(tomorrow);
          }
        }}
      >
        <i className="fa fa-chevron-right" />
      </ArrowBtn>
    </Top>
    <DaysRow>
      {genDays(base).map((x, i) => (
        <Day
          key={i}
          active={dateFns.isSameDay(x, current)}
          onClick={() => onNavigate(x)}
        >
          {dateFns.format(x, "DD")}
        </Day>
      ))}
    </DaysRow>
  </Picker>
);
export default DatePicker;
