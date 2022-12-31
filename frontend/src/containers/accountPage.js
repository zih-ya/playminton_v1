import React, { useState } from "react";
import styled from "styled-components";
import { Space, Typography, Input, Button, message } from "antd";
import axios from "../api";
import { useUserNEvent } from "../hooks/useUserNEvent";
import hash from "object-hash";

const PageWrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled(Space)`
  width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin: 50px 0 0 0;
`;

const AccountPage = () => {
  const { Title, Text } = Typography;
  const { isLogin, me } = useUserNEvent();

  // TODO: name not yet initialized (get request for user's name)
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const updateName = async () => {
    // TODO: backend update name
    const {
      data: { status, msg },
    } = await axios.post("/users/name", {
      email: me,
      name,
    });
    if (status) {
      message.success(msg);
    } else {
      message.error(msg);
    }
  };

  const updatePassword = async (hashedOldPassword, hashedNewPassword) => {
    const {
      data: { status, msg },
    } = await axios.post("/users/password", {
      email: me,
      newPassword: hashedNewPassword,
      oldPassword: hashedOldPassword,
    });
    if (status) {
      message.success(msg);
    } else {
      message.error(msg);
    }
  };

  const updatePasswordBtn = () => {
    if (oldPassword === "") {
      message.error("Current password is required!");
    } else if (newPassword !== newPassword2) {
      message.error("Two passwords aren't the same!");
    } else if (newPassword === "") {
      message.error("New password is required!");
    } else if (newPassword.length < 8) {
      message.error("New password is too short!");
    } else {
      updatePassword(hash.keys(oldPassword),hash.keys(newPassword))
    }
  }
  return (
    <PageWrapper>
      {isLogin ? (
        <Wrapper
          direction="vertical"
          size="middle"
          style={{
            display: "flex",
          }}
        >
          <Title level={3}>Email</Title>
          <Text keyboard>{me}</Text>
          <br />
          <Title level={3}>Name</Title>
          <Space>
            <Input
              style={{ width: 310 }}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Button type="primary" onClick={updateName}>
              Update
            </Button>
          </Space>
          <br />
          <Title level={3}>Joined events</Title> {/* 還沒想好怎麼顯示/排版 */}
          <br />
          <Title level={3}>Update Password</Title>
          <Space>
            <Text>Current Password</Text>
            <Input
              type="password"
              style={{ width: 275 }}
              placeholder="Enter your current password."
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
          </Space>
          <Space>
            <Text>New Password</Text>
            <Input
              type="password"
              style={{ width: 275, marginLeft: 20 }}
              placeholder="Enter your new password."
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </Space>
          <Space>
            <Text>New Password</Text>
            <Input
              type="password"
              style={{ width: 275, marginLeft: 20 }}
              placeholder="Enter your new password again."
              onChange={(e) => {
                setNewPassword2(e.target.value);
              }}
            />
          </Space>
          <Text mark>
            Notice: The length of a password should not less than 8.
          </Text>
          <Button type="primary" onClick={updatePasswordBtn}>
            Update
          </Button>
          {/* <Button type='primary' onClick={handleAdd}>Build Event</Button> */}
        </Wrapper>
      ) : (
        <Text mark>You haven't logged in yet.</Text>
      )}
    </PageWrapper>
  );
};

export default AccountPage;
