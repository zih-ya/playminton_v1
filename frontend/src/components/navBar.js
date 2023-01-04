import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "../api";
import { Space, Divider, Typography, Button, message, Drawer } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useUserNEvent } from '../hooks/useUserNEvent';
import './navBar.css';
import logo from '../logo.png';


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
    const [ open, setOpen ] = useState(false);

    const { Title } = Typography;

    const logout = async() => {
      setOpen(false);
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
          <img 
            style={{height:'40px', borderRadius: '28px', cursor: 'pointer'}} 
            src={logo} 
            alt="Logo" 
            onClick={() => navigate("/")}/>
          <MenuOutlined className='drawer' style={{marginTop: '18px', marginRight: '5px'}} onClick={() => {setOpen(true)}}/>
          <Drawer 
            className='drawer'
            placement="right" 
            onClose={() => {setOpen(false)}} 
            open={open}
            width='200px'>
            <Title 
              style={{cursor: 'pointer'}} 
              level={4} 
              onClick={() => { setOpen(false); navigate("/"); }}
            >Home</Title>
            <Title 
              style={{cursor: 'pointer'}} 
              level={4} 
              onClick={() => { setOpen(false); navigate("/events"); }}
            >Events</Title>
            <Title 
              style={{cursor: 'pointer'}} 
              level={4} 
              onClick={() => { setOpen(false); navigate("/newevent"); }}
            >Build event</Title>
            <br />
            {isLogin ? 
              <Space direction='vertical'>
                <Title 
                  style={{cursor: 'pointer'}} 
                  level={5} 
                  onClick={() => { setOpen(false); navigate("/account"); }}
                >Account</Title>
                <Space style={{cursor: 'pointer'}} onClick={logout}>
                  <Title 
                    level={5} 
                  >Log out</Title>
                  <LogoutOutlined style={{paddingBottom: '5px'}}/>
                </Space>  
            </Space> : 
              <Space direction='vertical'>
                  <Title 
                    style={{cursor: 'pointer'}} 
                    level={5} 
                    onClick={() => { setOpen(false); navigate("/login"); }}
                  >Log in</Title>
                  <Title 
                    style={{cursor: 'pointer'}} 
                    level={5} 
                    onClick={() => { setOpen(false); navigate("/register"); }}
                  >Register</Title>
              </Space>}
          </Drawer>
          <Space split={<Divider 
                          type="vertical" 
                          style={{borderColor: 'black', borderWidth: 2, height:25 }} />}
                 className='topbar'>
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
          <div className='topbar'>
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
                  <LogoutOutlined onClick={logout} />
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

// const App = () => {
//   const showDrawer = () => {
//     setOpen(true);
//   };
//   const onClose = () => {
//     setOpen(false);
//   };
//   return (
//     <>
//       <Button type="primary" onClick={showDrawer}>
//         Open
//       </Button>
//       <Drawer title="Basic Drawer" placement="right" onClose={onClose} open={open}>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//         <p>Some contents...</p>
//       </Drawer>
//     </>
//   );
// };
