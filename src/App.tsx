import React, { useState } from "react";
import styled, { css } from "styled-components";
import CountUp from "react-countup";

import validateSlot from "./validateBookingRules";
import { ExistingBooking, BookingRule } from "./interfaces";

import {
  openingHours,
  bookingRules,
  busySlots,
  peakTimes,
  pricing
} from "./data";
import { getPriceForTime } from "./util";

import Layout from "./components/Layout";
import DatePicker from "./components/DatePicker";
import TimeRow from "./components/Row";
import Footer from "./components/Footer";
import ErrorMessage from "./components/Errormessage";

const Scrollable = styled.div`
  width: 100%;
  height: calc(100vh - 50px - 75px);
  overflow-y: scroll;
`;

const Header = styled.div`
  background: #fff;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
`;

const TimeCol = styled.div`
  height: 40px;
  width: 70px;
  font-size: 14px;
  color: #ccc;
  border-right: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoomName = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
`;

const App: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
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
    <Layout>
      <Scrollable>
        <DatePicker
          base={new Date()}
          current={currentDay}
          onNavigate={(d: Date) => setCurrentDay(d)}
        />
        <Header>
          <TimeCol>&nbsp;</TimeCol>
          <RoomName>The Green Room</RoomName>
        </Header>

        {openingHours.slice(0, openingHours.length - 1).map((x: number) => {
          const isBusy =
            busySlots.filter((b: any) => x >= b.from && x < b.until).length > 0;

          const isSelected =
            selectedTimes.map((x: any) => x.time).indexOf(x) > -1;

          return (
            <TimeRow
              key={x}
              time={x}
              isBusy={isBusy}
              isSelected={isSelected}
              onClickRow={onClickRow}
            />
          );
        })}
      </Scrollable>

      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

      <Footer
        total={calcTotal()}
        onConfirm={onConfirm}
        isValid={isValid && selectedTimes.length > 0}
      />
    </Layout>
  );
};

export default App;
