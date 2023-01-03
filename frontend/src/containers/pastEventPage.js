import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Typography, Card, Button } from 'antd';
import axios from "../api";
import validator from "email-validator";
import { useUserNEvent } from "../hooks/useUserNEvent";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  //   justify-content: center;
  //   align-items: start;
`;

const PastEventPage = () => {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);

  const get_datas = async() => {
    let data = await axios.get("/games", {
      params: { isFuture: false },
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

  // const datas = [
  //   { 
  //    id:"d69b9397-a2a4-40e8-ac1a-9bf380c5fbbd",
  //    date:"2022/12/31",
  //    startTime:"00:00",
  //    endTime:"00:05",
  //    place:"123",
  //    host:"AAA",
  //    participants:["AAA","AAA","AAA"],
  //    numberLeft:0,
  //    notes:”no”
  //   },
  // ];
  return (
    <div>
      <Button 
        type="link" 
        style={{ marginLeft: 30 }}
        onClick={() => navigate("/events")}>
        Events currently open
      </Button>
      <Wrapper>
        {datas.map((data, i) => {
          return (
            <Card
              key={i}
              style={{
                width: 300,
                marginLeft: 30,
                marginTop: 15
              }}
            >
              <p style={{color: "gray"}}>Date: {data.date}</p>
              <p style={{color: "gray"}}>Time: {combine_time(data.startTime, data.endTime)}</p>
              <p style={{color: "gray"}}>Place: {data.place}</p>
              <p style={{color: "gray"}}>Host: {data.host.username}</p>
              <div style={{display: 'flex', flexWrap: 'wrap', width: '250px'}}>
              <p style={{marginRight: '5px', color: "gray"}}>Participants:</p>
                  {data.participants.map((participant, j) => 
                    <p 
                      key={j}
                      style={{marginRight: '5px', color: "gray"}}>
                    {participant.username}{","}
                    </p>
                  )}
              </div>
              <p style={{color: "gray"}}>Number Left: {data.numberLeft}</p>
              <p style={{color: "gray"}}>Note: {data.notes}</p>
              <Typography.Text mark>
                The event has closed.
              </Typography.Text>
            </Card>
          );
        })}
      </Wrapper>
    </div>
  );
};

export default PastEventPage;
