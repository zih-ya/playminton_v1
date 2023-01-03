import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Space, DatePicker, TimePicker, Typography, Input, Button, message } from "antd";
import axios from "../api";
import { useUserNEvent } from '../hooks/useUserNEvent';

const PageWrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled(Space)`
  width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin: 150px 0 0 0;

  .starlabel label:after {
    content:" *";
    color: red;
  }
`;

const BuildEventPage = () => {
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY/MM/DD";
  const format = "HH:mm";
  // const today = new Date().toLocaleDateString("zh-CN",{day: "2-digit", month: "2-digit", year: "numeric"});
  const today = new Date().toISOString().split`-`.join`/`.slice(0,10);
  //const today = new Date().toLocaleDateString("zh-CN");
  const [dateString, setDateString] = useState(today);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [place, setPlace] = useState("");
  const [people, setPeople] = useState("");
  const [notes, setNotes] = useState("");

  const {isLogin, me} = useUserNEvent();
  const navigate = useNavigate();
  const { Text } = Typography;
  // create new event
  const handleAdd = async () => {
    if (place === "") {
      message.error("'Place' is empty.")
    } else if (people === "") {
      message.error("'Open positions' is empty.")
    } else if (parseInt(people) < 1) {
      message.error("Open positions should be more than 1.")
    } else {
      const {
        data: { msg },
      } = await axios.post("/events", {
        dateString,
        startTime,
        endTime,
        place,
        people,
        notes,
        host: me
      });
      message.success(msg);
      navigate("/events");
    }
  };

  return (
    <PageWrapper>
      { isLogin ? 
      <Wrapper
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
        }}>
        <Space>
          <Text>Date</Text>
          <DatePicker
            defaultValue={dayjs(dateString, dateFormat)}
            format={dateFormat}
            onChange={(date, dateString) => {
              setDateString(dateString);
              console.log(dateString);
            }}
          />
        </Space>
        <Space>
          <Text>From</Text>
          <TimePicker
            minuteStep={10}
            value={dayjs(startTime, format)}
            format={format}
            onSelect={(time) => {
              setStartTime(dayjs(time).format("HH:mm"));
              console.log(dayjs(time).format("HH:mm"));
            }}
          />
          <Text>To</Text>
          <TimePicker
            minuteStep={10}
            value={dayjs(endTime, format)}
            format={format}
            onSelect={(time) => {
              setEndTime(dayjs(time).format("HH:mm"));
              console.log(dayjs(time).format("HH:mm"));
            }}
          />
        </Space>
        <Space>
          <Text>Place<span style={{color: 'red'}}>*</span></Text>
          <Input
            style={{width: 275}}
            placeholder="Where is this event held?"
            onChange={(e) => {
              setPlace(e.target.value);
            }}
          />
        </Space>
        <Space>
          <Text >Open positions<span style={{color: 'red'}}>*</span></Text>
          <Input
            type='number'
            style={{width: 213}}
            placeholder="How many positions left?"
            onChange={(e) => {
              setPeople(e.target.value);
            }}
          />
        </Space>
        <Space>
          <Text>Note</Text>
          <Input
            style={{width: 285}}
            placeholder="Any other infomation?"
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
        </Space>
        <Button type='primary' onClick={handleAdd}>Build Event</Button>
      </Wrapper>
      : <Text mark>
      To build a event, please <span style={{cursor: 'pointer', color: 'cornflowerblue'}} onClick={() => navigate("/login")}>log in</span> or <span style={{cursor: 'pointer', color: 'cornflowerblue'}} onClick={() => navigate("/register")}>register</span> first. 
    </Text>}
    </PageWrapper>
  );
};

export default BuildEventPage;
