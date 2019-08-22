import _ from "lodash";
import React, { useState } from "react";
import styled from "styled-components";
import * as dateFns from "date-fns";

import Layout from "./components/Layout";
import Footer from "./components/Footer";

const Section = styled.div`
  padding: 15px 10px;
`;

const Scroll = styled.div`
  overflow-y: auto;
  height: 100%;
  padding-bottom: 150px;
`;

const Summary = styled.div`
  margin-bottom: 20px;
  h1 {
    font-size: 16px;
    margin-bottom: 5px;
  }
  h4 {
    font-size: 14px;
    font-weight: normal;
  }
`;

const Breakdown = styled.div`
  display: flex;
  align-items: space-between;
`;
const Left = styled.div`
  flex: 1;
`;
const Title = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;
const Subtitle = styled.div`
  font-size: 12px;
  color: #aaa;
`;
const Price = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Heading = styled.div`
  background: #efefef;
  padding: 10px 10px;
  margin: 0 -10px;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;
const Label = styled.label`
  display: block;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
`;
const Input = styled.input`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  min-height: 100px;
`;

const Finalise: React.SFC<any> = ({ history, location }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("");

  const { state } = location;

  console.log(state);

  if (!state) {
    history.push("/");
  }
  // percentages
  const validCodes: any = {
    "10OFF": 0.9,
    "50OFF": 0.5
  };

  const changeCode = (e: any) => {
    const val = e.target.value;

    if (_.get(validCodes, val)) {
      setCode(val);
    }
  };

  const { date, bookingOption, selectedTimes, totalPrice } = state;

  const groupPrices = _.groupBy(selectedTimes, "price");

  const isValid = Boolean(name && email);

  const calcFinalPrice = () => {
    if (code) {
      const codeVal = validCodes[code] || 0;
      return totalPrice * codeVal;
    }

    return totalPrice;
  };

  return (
    <Layout>
      <Scroll>
        <Section>
          <Summary>
            <h1>Booking Summary at GrooveLabs</h1>
            <h4>
              {dateFns.format(date, "dddd, DD MMMM YYYY")}
              <br /> {selectedTimes[0].time}
              :00 - {selectedTimes[selectedTimes.length - 1].time}
              :00
            </h4>
          </Summary>
          <Breakdown>
            <Left>
              <Title>{bookingOption.title}</Title>
              <Subtitle>
                {_.map(groupPrices, (val, key) => (
                  <div key={key}>
                    {val.length}x 1h at £{Number(key).toFixed(2)}
                  </div>
                ))}
              </Subtitle>
            </Left>
            <Price>£{Number(totalPrice).toFixed(2)}</Price>
          </Breakdown>
        </Section>

        <Section>
          <Heading>Your Details</Heading>
          <FormGroup>
            <Label>Your Name*</Label>
            <Input
              placeholder="First + Last name"
              onChange={e => setName(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address*</Label>
            <Input
              placeholder="john@doe.com"
              type="email"
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              placeholder="Optional"
              onChange={e => setPhone(e.target.value)}
            />
          </FormGroup>
        </Section>

        <Section>
          <Heading>Notes & Requests</Heading>
          <Textarea
            placeholder="Enter any additional information, requests or similar..."
            onChange={e => setNotes(e.target.value)}
          />
        </Section>

        <Section>
          <Heading>Promo Codes</Heading>
          Have a Promo Code? Enter it here and save some money!
          <div style={{ height: "10px" }} />
          <Input placeholder="Enter Promo Code..." onChange={changeCode} />
        </Section>
      </Scroll>

      <Footer
        total={calcFinalPrice()}
        onConfirm={() => alert("yo")}
        isValid={isValid}
      />
    </Layout>
  );
};

export default Finalise;
