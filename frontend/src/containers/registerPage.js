import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";
import styled from "styled-components";
import { Input, Button, message, Space, Typography } from "antd";
import validator from "email-validator";
import hash from "object-hash";

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
  margin: 50px 0 0 0;
`;

const RegisterPage = () => {
  const { Text } = Typography;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  const register = async (email, hashedPassword) => { 
    const {
      data: { status, msg },
    } = await axios.post("./users", { email, password: hashedPassword, name });
    if (!status) {
      // print error message
      message.error(msg);
    } else {
      // print register sucessfully
      message.success("Register successfully, please login");
      navigate("/login");
    }
  };

  const registerBtn = () => {
    if (email === "") {
      message.error("Email is required!");
    } else if (!validator.validate(email)) {
      message.error("Email is invalid!");
    } else if (name === "") {
      message.error("Name is required!");
    } else if (password !== password2) {
      message.error("Two passwords aren't the same!");
    } else if (password === "") {
      message.error("Password is required!");
    } else if (password.length < 8) {
      message.error("Password is too short!");
    } else {
      register(email, hash.keys(password));
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
          <Text>Name<span style={{color: 'red'}}> *</span></Text>
          <Input
            style={{width: 300}}
            placeholder="Please enter your username"
            onChange={(e) => {
              setName(e.target.value);
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
        <Space
          direction="vertical"
          size="small">
          <Text>Re-enter Password<span style={{color: 'red'}}> *</span></Text>
          <Input
            style={{width: 300}}
            type="password"
            placeholder="Please enter your password again"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
        </Space>
        <Text mark>
            Notice: The length of a password should not less than 8.
        </Text>
        <Button type="primary" onClick={registerBtn}>
            Register
        </Button>
      </Wrapper>
    </PageWrapper>
  );
};

export default RegisterPage;
