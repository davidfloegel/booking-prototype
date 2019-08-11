import React, { useState } from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;

  max-width: 400px;
`;

const Left = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  overflow-y: scroll;
  // border: 1px solid red;
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
  width: 50px;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  padding: 0 15px;
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

const bookingRules = [
  {
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], // on which days does this rule apply
    allDay: true, // does this rule apply all day?
    between: [10, 24], // if not all day, between what time does this rule apply
    minBookingLength: 180, // what's the minimum booking length required? in minutes
    allowFillSlots: true, // allow people to book slots shorter than the min if they fill up holes
    minDistanceBetweenSlots: 120 // if leaving space between exisiting bookings, how many minutes at least?
  }
];

const busySlots = [
  // { id: 1, from: 10, until: 13 },
  { id: 2, from: 15, until: 16 },
  { id: 3, from: 17, until: 19 }
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
  const [errorMsg, setErrorMsg] = useState<string>();

  const onClickRow = (time: number, price: number) => {
    setErrorMsg(undefined);

    const rulesToCheck = bookingRules[0]; // check multiple
    const times = selectedTimes.map((x: any) => x.time);

    // unselect?
    const isSelected = times.indexOf(time) > -1;
    if (isSelected) {
      const idx = times.indexOf(time);

      if (times.length === 1) {
        setSelectedTimes([]);
        return;
      }

      // unselect all slots after the selected time
      setSelectedTimes([...selectedTimes.slice(0, idx + 1)]);

      return;
    }

    // check if user is leaving at least 2 hours between existing slots
    // when selecting the first time
    if (
      rulesToCheck.minDistanceBetweenSlots &&
      times.length >= 0 &&
      busySlots.length > 0
    ) {
      // find slots starting before selected time
      const before = busySlots.filter(b => b.until <= time);
      const after = busySlots.filter(b => b.from >= time);

      let ignoreDistanceChecks = false;
      if (times.length > 0 && before.length > 0 && after.length > 0) {
        const last = before[before.length - 1];
        const first = after[0];

        const distance = (first.from - last.until) * 60;

        if (distance <= rulesToCheck.minDistanceBetweenSlots) {
          ignoreDistanceChecks = true;
        }
      }

      if (!ignoreDistanceChecks) {
        if (before.length > 0 && times.length === 0) {
          const last = before[before.length - 1];

          const distance = (time - last.until) * 60;

          if (distance > 0 && distance < rulesToCheck.minDistanceBetweenSlots) {
            setErrorMsg(
              `Please leave no gap or at least ${rulesToCheck.minDistanceBetweenSlots /
                60} hours inbetween slots`
            );
            return;
          }
        }

        if (after.length > 0) {
          const first = after[0];
          const distance = (first.from - 1 - time) * 60;

          if (distance > 0 && distance < rulesToCheck.minDistanceBetweenSlots) {
            setErrorMsg(
              `Please leave no gap or at least ${rulesToCheck.minDistanceBetweenSlots /
                60} hours inbetween slots`
            );
            return;
          }
        }

        if (times.length === 0) {
          const distanceToOpening = (time - openingHours[0]) * 60;

          if (
            distanceToOpening > 0 &&
            distanceToOpening < rulesToCheck.minDistanceBetweenSlots
          ) {
            setErrorMsg(
              `Please leave no gap or at least ${rulesToCheck.minDistanceBetweenSlots /
                60} hours between your slot and the opening time`
            );
          }
        }

        if (times.length > 0) {
          const distanceToClosing =
            (openingHours[openingHours.length - 1] -
              times[times.length - 1] -
              1) *
            60;

          if (
            distanceToClosing > 0 &&
            distanceToClosing < rulesToCheck.minDistanceBetweenSlots
          ) {
            setErrorMsg(
              `Please leave no gap or at least ${rulesToCheck.minDistanceBetweenSlots /
                60} hours between your slot and the closing time`
            );
          }
        }
      }
    }

    // select range
    let addTimes = [];
    if (times.length >= 1) {
      const rangeStart = times[0];
      for (let i = rangeStart; i <= time; i++) {
        const price = getPriceForTime(i);
        addTimes.push({ time: i, price });
      }

      // check if busy slot is within the selected range
      const containsBusySlot = busySlots.filter(
        (b: any) => b.from >= rangeStart && b.until <= time
      );

      if (containsBusySlot.length > 0) {
        setErrorMsg(`Your booking range contains busy slots`);
      } else {
        setSelectedTimes(addTimes.sort());
      }
    } else {
      // set initial time
      const price = getPriceForTime(time);
      addTimes = [{ time, price }];
      setSelectedTimes([...selectedTimes, ...addTimes].sort());
    }
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

          {openingHours.map((x: number) => {
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
    </Container>
  );
};

export default App;
