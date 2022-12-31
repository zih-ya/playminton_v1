import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Typography, Card, Button, Space, message, Tooltip } from 'antd';
import { useUserNEvent } from '../hooks/useUserNEvent';
import axios from "../api";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  //   justify-content: center;
  //   align-items: start;
`;

const EventPage = () => {
  const { isLogin, me } = useUserNEvent();
  const navigate = useNavigate();
  // 應該要送一個 get request 拿回所有尚未結束的 events 來 render
  const [datas, setDatas] = useState([]);

  const get_datas = async() => {
    let data = await axios.get("/games", {
      params: { isFuture: true },
    });
    setDatas(data.data);
  }

  useEffect(()=>{
    get_datas();
  },[])

  const combine_time = (startTime, endTime) => {
    let time = startTime+"-"+endTime;
    return time;
  }

  const handleJoin = async (numberLeft, eventId, userEmail) => {
    console.log(eventId, userEmail); // can get correct eventId and userEmail
    const {
      data: { status, msg },
    } = await axios.post("/join", {
      id:eventId,
      email:userEmail
    });
    if(status)
    {
      get_datas();
      message.success(msg);
    }
    else message.error(msg);
  }

  const handleCancel = async (eventId, userEmail) => {
    console.log(eventId, userEmail); // can get correct eventId and userEmail
    const {
      data: { status, msg },
    } = await axios.post("/cancel", {
      id:eventId,
      email:userEmail
    });
    if(status)
    {
      get_datas();
      message.success(msg);
    }
    else message.error(msg);
  }

  /*const datas = [
    {
      id:"s89f78s9af7d89a",
      date: "2022.12.30",
      time: "4:00-6:00 pm",
      place: "NTU gym",
      host: "Anne",
      participants: "Mary, Peter, Amy, Daniel",
      numberLeft: "2",
      note: "Please bring your student ID card.",
    },
    {
      id:"89y83yf84huir93",
      date: "2023.1.2",
      time: "6:00-9:00 pm",
      place: "NTU gym",
      host: "Anne",
      participants: "Mary, Peter, Amy, Daniel",
      numberLeft: "6",
      note: "Happy new year everyone!",
    },
    {
      id:"dt839ughsdi4whj",
      date: "2023.1.6",
      time: "9:00-11:00 am",
      place: "NTU gym",
      host: "Anne",
      participants: "Mary, Peter, Amy, Daniel",
      numberLeft: "0",
      note: "nothing",
    },
  ];*/
  return (
    <div>
      {/* <Typography.Title>Opening Events</Typography.Title> */}
      <Button 
        type="link" 
        style={{ marginLeft: 30 }}
        onClick={() => navigate("/pastevents")}>
        Events in the past
      </Button>
      <Wrapper>
        {datas.length === 0 ? 
        <Typography.Text style={{ marginLeft: 45 }}>There's no event opening now.</Typography.Text>
        : <></>}
        {datas.map((data, i) => {
          return (
            <Card
              // title="Default size card"
              key={i}
              style={{
                width: 300,
                marginLeft: 30,
                marginTop: 15
              }}
            >
              <p>Date: {data.date}</p>
              <p>Time: {combine_time(data.startTime, data.endTime)}</p>
              <p>Place: {data.place}</p>
              <p>Host: {data.host}</p>
              <p>Participants: {data.participants.join(" ")}</p>
              <p>Number Left: {data.numberLeft}</p>
              <p>Note: {data.notes}</p>
              
              {isLogin ?
                <Space>
                  {data.numberLeft === 0 ?
                  <Tooltip placement="bottom" title='No available position now'>
                    <Button 
                    disabled
                    type="primary" 
                    onClick={() => {
                      handleJoin(data.numberLeft, data.id, me);
                    }}>Join</Button>
                  </Tooltip>
                  :
                  <Button 
                    type="primary" 
                    onClick={() => {
                      handleJoin(data.numberLeft, data.id, me);
                    }}>Join</Button>
                  }
                  <Button 
                    onClick={() => {
                      handleCancel(data.id, me);
                    }}>Cancel</Button>
                </Space> 
                : <Typography.Text mark>
                    To join the event, please log in or register first.
                  </Typography.Text>}
            </Card>
          );
        })}
      </Wrapper>
    </div>
  );
};

export default EventPage;
