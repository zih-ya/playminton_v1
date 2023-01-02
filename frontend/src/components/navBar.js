import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "../api";
import { Space, Divider, Typography, Button, message } from 'antd';
import styled from 'styled-components';
import { useUserNEvent } from '../hooks/useUserNEvent';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
  margin: 0;
  // background: green;
`;

const NavBar = () => {
    const {isLogin, setIsLogin, setMe} = useUserNEvent();
    const navigate = useNavigate();

    const { Title } = Typography;

    const logout = async() => {
      setIsLogin(false);
      navigate("/");
      setMe("");
      const {
        data: { msg, session_token, expires },
      } = await axios.get("/logout", {
        params: { session_token:document.cookie },
      });
      message.success(msg);
      document.cookie = "session_token:"+session_token+";expires:"+expires+";";
    }
    return (
        <Wrapper>
            <Title 
              style={{cursor: 'pointer'}} 
              level={1} 
              onClick={() => navigate("/")}
            >PlayMinton</Title>
          <Space split={<Divider 
                          type="vertical" 
                          style={{borderColor: 'black', borderWidth: 2, height:25 }} />}>
              <Title 
                style={{cursor: 'pointer'}} 
                level={3} 
                onClick={() => navigate("/")}
              >Home</Title>
              <Title 
                style={{cursor: 'pointer'}} 
                level={3} 
                onClick={() => navigate("/events")}
              >Events</Title>
              <Title 
                style={{cursor: 'pointer'}} 
                level={3} 
                onClick={() => navigate("/newevent")}
              >Build event</Title>
          </Space>
          <div>
            {isLogin ? 
              <Space split={<Divider 
                              type="vertical" 
                              style={{
                                borderColor: 'black', 
                                borderWidth: 1, 
                                height:15 }}/>}
                     style={{marginTop:15}}>
                  <Title 
                    style={{cursor: 'pointer'}} 
                    level={5} 
                    onClick={() => navigate("/account")}
                  >Account</Title>
                  <Button size='small' onClick={logout}>Log out</Button>
            </Space> : 
              <Space split={<Divider 
                              type="vertical" 
                              style={{borderColor: 'black', borderWidth: 1, height:15 }}/>}
                     style={{marginTop:15}}>
                  <Title 
                    style={{cursor: 'pointer'}} 
                    level={5} 
                    onClick={() => navigate("/login")}
                  >Log in</Title>
                  <Title 
                    style={{cursor: 'pointer'}} 
                    level={5} 
                    onClick={() => navigate("/register")}
                  >Register</Title>
              </Space>}
          </div>
        </Wrapper>
    )
}
export default NavBar;