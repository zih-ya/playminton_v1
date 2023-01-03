import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Typography, Card, Button, Space } from 'antd';
import { useUserNEvent } from '../hooks/useUserNEvent';
import axios from "../api";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  //   justify-content: center;
  //   align-items: start;
`;

const UserEventPage = () => {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const { me } = useUserNEvent();

  const fakeDatas = [
    { 
     id:"d69b9397-a2a4-40e8-ac1a-9bf380c5fbbd",
     date:"2022/12/31",
     startTime:"00:00",
     endTime:"00:05",
     place:"123",
     host:"AAA",
     participants:["AAA","AAA","AAA"],
     numberLeft:0,
     notes:"no"
    },
  ];

  const getUserDatas = async () => {
    setDatas(fakeDatas);

    // TODO: get data of certain user
    let data = await axios.get("/games", {
      params: { user: me },
    });
    setDatas(data.data);
  }
  useEffect(() => {
    if(me) getUserDatas();
  }, [me]);

  const combine_time = (startTime, endTime) => {
    let time = startTime+"-"+endTime;
    return time;
  }

  return (
    <div>
      <Button 
        type="link" 
        style={{ marginLeft: 30 }}
        onClick={() => navigate("/account")}>
        {"< Back to account page"}
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
              <p>Date: {data.date}</p>
              <p>Time: {combine_time(data.startTime, data.endTime)}</p>
              <p>Place: {data.place}</p>
              <p>Host: {data.host.username}</p>
              <div style={{display: 'flex', flexWrap: 'wrap', width: '250px'}}>
                <p style={{marginRight: '5px'}}>Participants:</p>
                  {data.participants.map((participant, j) => 
                    <p 
                      key={j}
                      style={{marginRight: '5px'}}>
                    {participant.username}{","}
                    </p>
                  )}
              </div>
              <p>Number Left: {data.numberLeft}</p>
              <p>Note: {data.notes}</p>
            </Card>
          );
        })}
      </Wrapper>
    </div>
  );
};

export default UserEventPage;
