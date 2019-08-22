import React, { useState } from "react";
import styled, { css } from "styled-components";
import * as dateFns from "date-fns";
import CountUp from "react-countup";

import validateSlot from "./validateBookingRules";
import { ExistingBooking, BookingRule } from "./interfaces";

import {
  openingHours,
  bookingRules,
  busySlots,
  peakTimes,
  pricing,
  bookingOptions
} from "./data";
import { isInPeak, getPriceForTime } from "./util";

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
  top: 96px;
`;

const TimeCol = styled.div`
  height: 40px;
  width: 80px;
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

const App: React.SFC<any> = ({ match }) => {
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const [selectedTimes, setSelectedTimes] = useState<any>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>();

  const bookingOption = bookingOptions.find(
    bo => bo.id === match.params.option
  );

  if (!bookingOption) {
    return <div>booking option not found</div>;
  }

  const dayabbrev = String(dateFns.format(currentDay, "ddd")).toLowerCase();
  const isAvailableOnThisDay =
    bookingOption.availableDays.indexOf(dayabbrev) > -1;

  const onClickRow = (time: number, price: number) => {
    setErrorMsg(undefined);

    const rulesToCheck = bookingOption.rules; // check multiple
    const times = selectedTimes.map((x: any) => x.time);

    let updatedTimes = selectedTimes;

    if (times.length > 1) {
      if (time < times[0]) {
        return setSelectedTimes([{ time, price }]);
      }
    }

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
          const price = isInPeak(dayabbrev, i)
            ? bookingOption.peakPrice
            : bookingOption.price;
          addTimes.push({ time: i, price });
        }

        updatedTimes = addTimes.sort();
      } else {
        // set initial time
        addTimes = [{ time, price }];
        updatedTimes = [...selectedTimes, ...addTimes].sort();
      }
    }

    try {
      const selectedSlot: [number, number] = [
        updatedTimes[0].time,
        updatedTimes[updatedTimes.length - 1].time
      ];
      const hours: [number, number] = [
        openingHours[0],
        openingHours[openingHours.length - 1]
      ];
      validateSlot(hours, busySlots, bookingOption.rules, selectedSlot);

      setSelectedTimes(updatedTimes);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
      setErrorMsg(e.message);
    }
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
      validateSlot(hours, busySlots, bookingOption.rules, selectedSlot, true);
      setIsValid(true);

      alert("Your booking is valid :)");
    } catch (e) {
      setIsValid(false);
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

  const findRulesWithDaysAhead = bookingOption.rules.filter(
    (rule: BookingRule) =>
      rule.allowDaysAhead !== undefined && rule.allowDaysAhead >= 0
  );

  const currentDayPeakTimes = peakTimes[dayabbrev];
  const numberDaysAhead = dateFns.differenceInCalendarDays(
    currentDay,
    new Date()
  );

  return (
    <Layout>
      <Scrollable>
        <DatePicker
          base={new Date()}
          current={currentDay}
          onNavigate={setCurrentDay}
        />
        {isAvailableOnThisDay ? (
          <>
            <Header>
              <TimeCol>&nbsp;</TimeCol>
              <RoomName>The Green Room</RoomName>
            </Header>

            {openingHours.slice(0, openingHours.length - 1).map((x: number) => {
              const isBusy =
                busySlots.filter((b: any) => x >= b.from && x < b.until)
                  .length > 0;

              const isSelected =
                selectedTimes.map((x: any) => x.time).indexOf(x) > -1;

              const isTimeInPeak = isInPeak(dayabbrev, x);
              const peakRules = findRulesWithDaysAhead.find(r => r.onlyInPeak);
              const offPeakRules = findRulesWithDaysAhead.find(
                r => r.onlyInOffPeak
              );

              let useRule = isTimeInPeak ? peakRules : offPeakRules;
              const disable =
                useRule && useRule.allowDaysAhead !== undefined
                  ? numberDaysAhead > useRule.allowDaysAhead
                  : false;

              return (
                <TimeRow
                  key={x}
                  day={dayabbrev}
                  time={x}
                  isBusy={isBusy}
                  price={bookingOption.price}
                  peakPrice={bookingOption.peakPrice}
                  isSelected={isSelected}
                  onClickRow={onClickRow}
                  disabled={disable}
                />
              );
            })}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "25px 10px" }}>
            You can't book {bookingOption.title} on{" "}
            {dateFns.format(currentDay, "dddd")}s
          </div>
        )}
      </Scrollable>

      {errorMsg && (
        <ErrorMessage onClose={() => setErrorMsg(undefined)}>
          {errorMsg}
        </ErrorMessage>
      )}

      <Footer
        total={calcTotal()}
        onConfirm={onConfirm}
        isValid={isValid && selectedTimes.length > 0}
      />
    </Layout>
  );
};

export default App;
