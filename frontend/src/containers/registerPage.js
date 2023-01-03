import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";
import styled from "styled-components";
import { Input, Button, message, Space, Typography, Modal } from "antd";
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
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const register = async (email, hashedPassword) => {
    const {
      data: { status, msg },
    } = await axios.post("./user/register", {
      email,
      msg: "register",
    });
    if (!status) {
      message.error(msg);
    } else {
      setIsModalOpen(true);
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

  const checkCode = async () => {
    // check if code is correct
    const hashedPassword = hash.keys(password);
    const {
      data: { valid, msg },
    } = await axios.get("./user/validation", {
      params: { code, email, name, password: hashedPassword },
    });
    if (valid) {
      message.success(msg);
      setIsModalOpen(false);
      navigate("/login");
    } else {
      message.error(msg);
      setCode("");
    }
  };

  const resendCode = async () => {
    // resend registration code
    await axios.post("./user/register", { email });
    message.success("Registration code resent");
  };

  return (
    <PageWrapper>
      <Wrapper direction="vertical" size="middle">
        <Space direction="vertical" size="small">
          <Text>
            Name<span style={{ color: "red" }}> *</span>
          </Text>
          <Input
            style={{ width: 300 }}
            placeholder="Please enter your username"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Space>
        <Space direction="vertical" size="small">
          <Text>
            Email<span style={{ color: "red" }}> *</span>
          </Text>
          <Input
            style={{ width: 300 }}
            type="email"
            placeholder="Please enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Space>
        <Space direction="vertical" size="small">
          <Text>
            Password<span style={{ color: "red" }}> *</span>
          </Text>
          <Input
            style={{ width: 300 }}
            type="password"
            placeholder="Please enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Text mark>
            Notice: The length of a password should not less than 8.
          </Text>
        </Space>
        <Space direction="vertical" size="small">
          <Text>
            Re-enter Password<span style={{ color: "red" }}> *</span>
          </Text>
          <Input
            style={{ width: 300 }}
            type="password"
            placeholder="Please enter your password again"
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
        </Space>
        <Button type="primary" onClick={registerBtn}>
          Register
        </Button>
        <Modal
          title="Enter your registration code"
          open={isModalOpen}
          onOk={checkCode}
          onCancel={() => {
            message.error("Register fail");
            setIsModalOpen(false);
            setCode("");
          }}
        >
          <Space direction="vertical" size="small">
            <Input
              style={{ width: 190 }}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <Button onClick={resendCode}>Resend Code</Button>
          </Space>
        </Modal>
      </Wrapper>
    </PageWrapper>
  );
};

export default RegisterPage;
