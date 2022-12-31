import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Space, Divider, Typography, Button } from 'antd';
import styled from 'styled-components';
import { useUserNEvent } from '../hooks/useUserNEvent';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 30px;
`;

const NavBar = () => {
    const {isLogin, setIsLogin, setMe} = useUserNEvent();
    const navigate = useNavigate();

    const { Title } = Typography;

    const logout = () => {
      setIsLogin(false);
      navigate("/");
      setMe("");
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