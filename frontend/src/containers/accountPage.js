import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactAvatar from "react-avatar-edit";
import styled from "styled-components";
import { Space, Typography, Input, Button, message, Avatar, Modal } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import axios from "../api";
import { useUserNEvent } from "../hooks/useUserNEvent";
import hash from "object-hash";

const PageWrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled(Space)`
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin: 50px 0 0 0;
`;

const AccountPage = () => {
  const { Title, Text } = Typography;
  const { isLogin, me } = useUserNEvent();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [intro, setIntro] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const getUserData = async () => {
    // TODO: get user name and avatar
    const {
      data: { msg, newprofile },
    } = await axios.get("/users/profile", {
      params: { email: me },
    });
    // message.success(msg);
    setName(newprofile.name);
    setAvatar(newprofile.avatar);
    setIntro(newprofile.intro);
  };

  useEffect(() => {

    if(me) getUserData();
  }, [me]);


  const updateName = async () => {
    if (name === "") {
      message.error("New name is blank");
    } else {
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
    }
    getUserData(); // render old name if update fails
  };

  const updateAvatar = async () => {
    if (preview === "") {
      message.error("New avatar is blank");
    } else {
      console.log(preview); // just for testing
      setIsModalOpen(false); // just for testing
      setAvatar(preview); // just for testing

      // TODO: update avatar in DB
      const {
        data: { status, msg },
      } = await axios.post("./user/avatar", {
        email: me,
        preview,
      });
      if (status) {
        message.success(msg);
        setIsModalOpen(false);
        setAvatar(preview);
      } else {
        message.error(msg);
      }
    }
  };

  const updateIntro = async () => {
    if (intro === "") {
      message.error("New intro is blank");
    } else {
      const {
        data: { status, msg },
      } = await axios.post("./user/intro", {
        email: me,
        intro,
      });
      if (status) {
        message.success(msg);
      } else {
        message.error(msg);
      }
    }
    getUserData(); // render old intro if update fails
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
      updatePassword(hash.keys(oldPassword), hash.keys(newPassword));
    }
  };
  return (
    <PageWrapper>
      {isLogin ? (
        <Wrapper
          direction="vertical"
          size="large"
          style={{
            display: "flex",
          }}
        >
          <Space direction="vertical" size="small">
            <Title level={3}>Email</Title>
            <Text keyboard>{me}</Text>
          </Space>
          <Space direction="vertical" size="small">
            <Title level={3}>Name</Title>
            <Space direction="vertical" size="small">
              <Input
                style={{ width: 190 }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Button type="primary" onClick={updateName}>
                Update
              </Button>
            </Space>
          </Space>
          <Space direction="vertical" size="small">
            <Title level={3}>Avatar</Title>
            {avatar === "" ? (
              <Avatar size={100} icon={<UserOutlined />} />
            ) : (
              <img style={{ height: "100px" }} src={avatar} />
            )}
            <Button
              icon={<UploadOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Upload
            </Button>
            <Modal
              width={450}
              title="Upload your new avatar"
              open={isModalOpen}
              okText="Save"
              onOk={updateAvatar}
              onCancel={() => {
                setIsModalOpen(false); // can't close the upload image QQ
              }}
            >
              <div style={{ marginLeft: "0px" }}>
                <ReactAvatar
                  width={400}
                  height={200}
                  onCrop={(view) => setPreview(view)}
                  onClose={() => setPreview(null)}
                  src={src} // conmment this line will get error, why?
                  // exportSize={67} // limit the data size
                />
              </div>
            </Modal>
          </Space>
          <Space direction="vertical" size="small">
            <Title level={3}>Intro</Title>
            <Space direction="vertical" size="small">
              <Input.TextArea
                rows={3}
                style={{ width: 400 }}
                value={intro}
                placeholder="Say something about yourself"
                onChange={(e) => {
                  setIntro(e.target.value);
                }}
              />
              <Button type="primary" onClick={updateIntro}>
                Update
              </Button>
            </Space>
          </Space>
          <Space direction="vertical" size="small">
            <Title
              style={{ cursor: "pointer", color: "cornflowerblue" }}
              level={3}
              onClick={() => navigate("/account/event")}
            >
              {"Joined events >"}
            </Title>
          </Space>
          <Space direction="vertical" size="middle">
            <Title level={3}>Update Password</Title>
            <Space direction="vertical" size="small">
              <Text>Current Password</Text>
              <Input
                type="password"
                style={{ width: 400 }}
                placeholder="Enter your current password."
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
              />
            </Space>
            <Space direction="vertical" size="small">
              <Text>New Password</Text>
              <Input
                type="password"
                style={{ width: 400 }}
                placeholder="Enter your new password."
                onChange={(e) => {
                  setNewPassword(e.target.value);
                }}
              />
            </Space>
            <Space direction="vertical" size="small">
              <Text>New Password</Text>
              <Input
                type="password"
                style={{ width: 400 }}
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
          </Space>
        </Wrapper>
      ) : (
        <Text mark>To check your information, please <span style={{cursor: 'pointer', color: 'cornflowerblue'}} onClick={() => navigate("/login")}>log in</span> or <span style={{cursor: 'pointer', color: 'cornflowerblue'}} onClick={() => navigate("/register")}>register</span> first.</Text>
      )}
    </PageWrapper>
  );
};

export default AccountPage;
