import React, { useState } from "react";
import styled, { css } from "styled-components";
import CountUp from "react-countup";

import validateSlot from "./validateBookingRules";
import { ExistingBooking, BookingRule } from "./interfaces";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  max-width: 400px;
`;

const Left = styled.div`
  width: 100%;
  height: calc(100vh - 50px - 75px);
  overflow-y: scroll;
`;
const Right = styled.div`
  display: none;
  width: 300px;
  padding: 0 50px;
`;

const Heading = styled.div`
  height: 50px;
  background: #fff;
  border-bottom: 1px solid #ccc;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 20px;
    margin: 0;
    padding: 0;
  }
`;

const Grid = styled.div`
  // border: 1px solid #ccc;
`;

const Header = styled.div`
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
`;

const TimeCol = styled.div`
  height: 40px;
  width: 70px;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Row = styled(Header)`
  &:last-of-type {
    border-bottom: none;
  }
`;

const RoomName = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  font-weight: bold;
`;

const TimeSlot = styled.div<any>`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;

  ${({ isBusy, isSelected }) => css`
    ${!isBusy &&
      css`
        &:hover {
          background: rgba(46, 204, 113, 0.25);
          cursor: pointer;
        }
      `};

    ${isBusy &&
      css`
        background: #eee;
        font-size: 12px;
        color: #ccc;
      `};

    ${isSelected &&
      css`
        background: rgba(46, 204, 113, 0.25);
      `};
  `};
`;

const ErrorMessage = styled.div`
  background: #eb4d4b;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  padding: 10px;
  position: absolute;
  top: 60px;
  left: 5px;
  right: 5px;
`;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
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
  color: #ccc;
`;

const ConfirmButton = styled.button<any>`
  font-size: 16px;
  padding: 15px 25px;
  border: none;
  background: #2ecc71;
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

const openingHours = [
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24
];

const bookingRules: BookingRule[] = [
  {
    id: "1",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    allDay: true,
    minLength: 180,
    allowFillSlots: true,
    minDistanceBetweenSlots: 120
  }
];

const busySlots: ExistingBooking[] = [
  // { id: 1, from: 10, until: 13 },
  // { id: 2, from: 15, until: 16 },
  // { id: 3, from: 17, until: 19 },
  // { id: 4, from: 23, until: 25 }
];

const peakTimes = {
  mon: [17, 24],
  tue: [17, 24],
  wed: [17, 24],
  thu: [17, 24],
  fri: [17, 24],
  sat: [14, 23],
  sun: [14, 23]
};

const pricing = {
  mon: { offPeak: 5, onPeak: 10 }
};

const getPriceForTime = (time: number) => {
  const peakTimeForDay = peakTimes["mon"]; // hardcoded
  const isInPeak = time >= peakTimeForDay[0] && time <= peakTimeForDay[1];
  const getPrice = isInPeak ? pricing["mon"].onPeak : pricing["mon"].offPeak;

  return getPrice;
};

const renderRow = (
  time: number,
  isBusy: boolean,
  isSelected: boolean,
  onClickRow: any
) => {
  const getPrice = getPriceForTime(time);

  return (
    <Row key={time}>
      <TimeCol>
        {time}
        :00
      </TimeCol>
      <TimeSlot
        isBusy={isBusy}
        isSelected={isSelected}
        onClick={() => (isBusy ? {} : onClickRow(time, getPrice))}
      >
        {isBusy ? "Busy" : `£${Number(getPrice).toFixed(2)}`}
      </TimeSlot>
    </Row>
  );
};

const App: React.FC = () => {
  const [selectedTimes, setSelectedTimes] = useState<any>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>();

  const onClickRow = (time: number, price: number) => {
    setErrorMsg(undefined);

    const rulesToCheck = bookingRules[0]; // check multiple
    const times = selectedTimes.map((x: any) => x.time);

    let updatedTimes = selectedTimes;

    // unselect?
    const isSelected = times.indexOf(time) > -1;
    if (isSelected) {
      const idx = times.indexOf(time);

      if (times.length === 1) {
        setSelectedTimes([]);
        return;
      } else {
        // unselect all slots after the selected time
        updatedTimes = [...selectedTimes.slice(0, idx + 1)];
      }
    } else {
      // select range
      let addTimes = [];
      if (times.length >= 1) {
        const rangeStart = times[0];
        for (let i = rangeStart; i <= time; i++) {
          const price = getPriceForTime(i);
          addTimes.push({ time: i, price });
        }

        updatedTimes = addTimes.sort();
      } else {
        // set initial time
        const price = getPriceForTime(time);
        addTimes = [{ time, price }];
        updatedTimes = [...selectedTimes, ...addTimes].sort();
      }
    }

    setSelectedTimes(updatedTimes);
    setIsValid(true);
  };

  const onConfirm = () => {
    const updatedTimes = selectedTimes;
    try {
      const selectedSlot: [number, number] = [
        updatedTimes[0].time,
        updatedTimes[updatedTimes.length - 1].time
      ];
      const hours: [number, number] = [
        openingHours[0],
        openingHours[openingHours.length - 1]
      ];
      validateSlot(hours, busySlots, bookingRules, selectedSlot);
      setIsValid(true);

      alert("Your booking is valid :)");
    } catch (e) {
      setIsValid(false);
      console.log(e);
      setErrorMsg(e.message);
    }
  };

  const calcTotal = () => {
    let total = 0;
    selectedTimes.forEach((t: any) => {
      total += t.price;
    });
    return total;
  };

  return (
    <Container>
      <Heading>
        <h1>Make a booking</h1>
      </Heading>
      <Left>
        <Grid>
          <Header>
            <TimeCol>&nbsp;</TimeCol>
            <RoomName>The Green Room</RoomName>
          </Header>

          {openingHours.slice(0, openingHours.length - 1).map((x: number) => {
            const isBusy =
              busySlots.filter((b: any) => x >= b.from && x < b.until).length >
              0;

            const isSelected =
              selectedTimes.map((x: any) => x.time).indexOf(x) > -1;

            return renderRow(x, isBusy, isSelected, onClickRow);
          })}
        </Grid>
      </Left>
      <Right>
        <h2>Summary</h2>
        {selectedTimes.map((x: any) => (
          <div key={x.time}>
            {x.time}
            :00 - £{Number(x.price).toFixed(2)}
          </div>
        ))}
        <br />
        <br />
        <b>Total:</b> £
        {selectedTimes
          .map((x: any) => x.price)
          .reduce((a: number, b: number) => a + b, 0)}
      </Right>

      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

      <Footer>
        <Total>
          <Price>
            <CountUp
              duration={0.25}
              prefix="£"
              decimals={2}
              decimal="."
              end={calcTotal()}
            />
          </Price>
          <TotalLabel>Total Booking Price</TotalLabel>
        </Total>
        <ConfirmButton
          onClick={onConfirm}
          disabled={!isValid || selectedTimes.length === 0}
        >
          Next
        </ConfirmButton>
      </Footer>
    </Container>
  );
};

export default App;
