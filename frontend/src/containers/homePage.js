import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Modal, Tooltip, Input, message } from 'antd';
import styled from 'styled-components';
import { useUserNEvent } from '../hooks/useUserNEvent';
import axios from "../api";

const HomePageWrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  margin: 100px 0 0 0;
`;

const HomePage = () => {
  const { isLogin, me } = useUserNEvent();
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ announcement, setAnnouncement ] = useState('');
  const [ data, setData ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  
  const get_data = async() => {
    let data = await axios.get("/announcements");
    setData(data.data);
  }

  // const data = [
  //     {id:'2uhfih2ohuicx23hr', date: '2022/12/12', author: 'aaa@aaa.aaa', msg: 'Basic structure of frontend pages done! See you after final week!'},
  //     {id:'892hcj42bhjsa73bf', date: '2022/12/10', author: 'bbb@bbb.bbb', msg: 'Hi everyone! This project "PlayMinton" starts here!'},
  //     ];
  
  const addAnnounce = async() => {
    if (announcement === "") {
      message.error("Your announcement is blank!")
    } else {
      const { 
        data: { msg },
      } = await axios.post("/announcements/add", {
        author:me,
        msg:announcement
      });
      get_data();
      message.success(msg);
      setIsModalOpen(false);
      setAnnouncement("");
    }
  }
  
  const deleteAnnounce = async(announcementID) => {
    const {
      data: { msg },
    } = await axios.post("/announcements/delete", {
      id:announcementID
    });
    get_data();
    message.success(msg);
    console.log(announcementID)
  }

  useEffect(()=>{ 
    setIsLoading(true);
    async function fetchData() { 
      await get_data();
      setIsLoading(false);
    } 
    fetchData();
    
  },[])

  return (
    <HomePageWrapper>
        <List
          style={{width: 650}}
          header={<div style={{ fontWeight: 'bold', 
                                fontSize: 20,
                                display: 'flex', 
                                justifyContent: 'space-between' }}>
            Announcement
            { isLogin ? 
            <Button 
              style={{alignSelf: 'end'}} 
              type="primary" 
              onClick={() => setIsModalOpen(true)}>
              Add
            </Button>
            :
            <Tooltip placement="top" title='Login to add an announcement'>
              <Button disabled style={{alignSelf: 'end'}} >
                Add
              </Button>
            </Tooltip>}
          </div>}
          loading={isLoading}
          bordered
          dataSource={data}
          renderItem={(item) => (
              <List.Item>
                <Typography.Text>{`[${item.date}] ${item.msg}`}</Typography.Text>
                { isLogin ? 
                <>
                  {item.author === me ? 
                  <Button danger onClick={() => deleteAnnounce(item.id)}>Delete</Button>
                  : 
                  <Tooltip placement="top" title="Don't delete others' announcement.">
                    <Button danger disabled>Delete</Button>
                  </Tooltip>}
                </>
                : 
                <></>}
              </List.Item>
          )}
        />
        <Modal 
          title="Add an announcement" 
          open={isModalOpen} 
          onOk={addAnnounce} 
          onCancel={() => {
            setIsModalOpen(false);
            setAnnouncement("")
          }}>
          <Input 
            placeholder='Something to announce'
            value={announcement}
            onChange={(e) => {
              setAnnouncement(e.target.value);
            }} />
        </Modal>
    </HomePageWrapper>
  )
};

export default HomePage;
