import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";
import styled from "styled-components";
import { Typography, Input, Button, Form, message, Space, Modal } from "antd";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setIsLogin, setMe } = useUserNEvent();
  const navigate = useNavigate();
  const [modalEmail, setModalEmail] = useState("");
  const [code, setCode] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalPassword2, setModalPassword2] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const login = async (email, password) => {
    const {
      data: { exist, msg, session_token, expires },
    } = await axios.get("/users", {
      params: { email, password },
    });

    if (exist) {
      // show "Successfully logged in"
      //document.cookie = "me="+email+";max-age=3600;";
      message.success(msg);
      setMe(email);
      setIsLogin(true);
      navigate("/events");
      document.cookie =
        "session_token:" + session_token + ";expires:" + expires + ";";
    } else {
      // show "Invalid email or password"
      message.error(msg);
    }
  };

  const loginBtn = () => {
    if (email === "") {
      message.error("Email is required.");
    } else if (!validator.validate(email)) {
      message.error("Email is invalid!");
    } else if (password === "") {
      message.error("Password is required.");
    } else {
      login(email, hash.keys(password));
    }
  };

  const resetPassword = async () => {
    if (modalEmail === "") {
      message.error("Email is required!");
    } else if (code === "") {
      message.error("Code is required!");
    } else if (modalPassword !== modalPassword2) {
      message.error("Two passwords aren't the same!");
    } else if (modalPassword === "") {
      message.error("Password is required!");
    } else if (modalPassword.length < 8) {
      message.error("Password is too short!");
    } else {
      const hashedPassword = hash.keys(modalPassword);
      const {
        data: { status, msg },
      } = await axios.post("./users/password", {
        newPassword: hashedPassword,
        code,
        msg: "forget",
        email: modalEmail,
      });
      if (status) {
        message.success(msg);
        setIsModalOpen(false);
        setModalEmail("");
        setCode("");
        setModalPassword("");
        setModalPassword2("");
        setIsCodeSent(false);
      } else {
        message.error(msg);
      }
    }
  };

  const sendCode = async () => {
    if (modalEmail === "") {
      message.error("Email is required!");
    } else if (!validator.validate(modalEmail)) {
      message.error("Email is invalid!");
    } else {
      await axios.post("./user/register", { email: modalEmail, msg: "reset" });
      message.success("Code is sent to you email");
      setIsCodeSent(true);
    }
  };

  return (
    <PageWrapper>
      <Wrapper direction="vertical" size="middle">
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
        </Space>
        <Space>
          <Button type="primary" onClick={loginBtn}>
            Log in
          </Button>
          <Button
            type="link"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Forget password?
          </Button>
        </Space>
        <Modal
          title="Set new Password"
          open={isModalOpen}
          onOk={resetPassword}
          okText="Reset Password"
          onCancel={() => {
            setIsModalOpen(false);
            setModalEmail("");
            setCode("");
            setModalPassword("");
            setModalPassword2("");
            setIsCodeSent(false);
          }}
        >
          <Space direction="vertical" size="middle">
            <Space direction="vertical" size="small">
              <Text>
                Email<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                disabled={isCodeSent}
                style={{ width: 300 }}
                type="email"
                value={modalEmail}
                placeholder="Please enter your email"
                onChange={(e) => {
                  setModalEmail(e.target.value);
                }}
              />
              <Button type="primary" onClick={sendCode}>
                (Re)Send Code
              </Button>
            </Space>
            <Space direction="vertical" size="small">
              <Text>
                Reset Password Code<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                style={{ width: 300 }}
                placeholder="Please enter your code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
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
                value={modalPassword}
                onChange={(e) => {
                  setModalPassword(e.target.value);
                }}
              />
            </Space>
            <Space direction="vertical" size="small">
              <Text>
                Re-enter Password<span style={{ color: "red" }}> *</span>
              </Text>
              <Input
                style={{ width: 300 }}
                type="password"
                placeholder="Please enter your password again"
                value={modalPassword2}
                onChange={(e) => {
                  setModalPassword2(e.target.value);
                }}
              />
            </Space>
          </Space>
        </Modal>
      </Wrapper>
    </PageWrapper>
  );
};

export default LoginPage;
