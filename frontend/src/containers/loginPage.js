import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";
import styled from "styled-components";
import { Typography, Input, Button, Form, message, Space } from "antd";
import { useUserNEvent } from "../hooks/useUserNEvent";
import hash from "object-hash";
import validator from "email-validator";

const PageWrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled(Space)`
  width: 330px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin: 100px 0 0 0;
`;

const LoginPage = () => {
  const { Text } = Typography;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLogin, setMe } = useUserNEvent();
  const navigate = useNavigate();

  const login = async (email, password) => {
    const {
      data: { exist, msg },
    } = await axios.get("/users", {
      params: { email, password },
    });

    if (exist) {
      // show "Successfully logged in"
      message.success(msg);
      setMe(email);
      setIsLogin(true);
      navigate("/events");
    } else {
      // show "Invalid email or password"
      message.error(msg);
    }
  };

  const loginBtn = () => {
    if (email === "") {
      message.error("Email is required.")
    } else if (!validator.validate(email)) {
      message.error("Email is invalid!");
    } else if (password === "") {
      message.error("Password is required.")
    } else {
      login(email, hash.keys(password));
    }
  };

  return (
    <PageWrapper>
      <Wrapper
        direction="vertical"
        size="middle"
      >
        <Space
          direction="vertical"
          size="small">
          <Text >Email<span style={{color: 'red'}}> *</span></Text>
          <Input
            style={{width: 300}}
            type="email"
            placeholder="Please enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Space>
        <Space
          direction="vertical"
          size="small">
          <Text>Password<span style={{color: 'red'}}> *</span></Text>
          <Input
            style={{width: 300}}
            type="password"
            placeholder="Please enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Space>
        <Button type="primary" onClick={loginBtn}>
            Log in
        </Button>
          {/* TODO: forget password */}
          {/* <Typography.Link 
            href="https://ant.design" 
            target="_blank"
            style={{marginLeft: 15}}>
            Forget password?
          </Typography.Link> */}
      </Wrapper>
    </PageWrapper>
  );
};

export default LoginPage;
