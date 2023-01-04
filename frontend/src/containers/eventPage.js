import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Typography, Card, Button, Space, message, Tooltip, Modal, DatePicker, TimePicker, Input, Select, Avatar } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import { useUserNEvent } from '../hooks/useUserNEvent';
import axios from "../api";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  //   justify-content: center;
  //   align-items: start;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 320px;

  @media screen and (max-width: 510px){
    width: 75vw;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;

  @media screen and (max-width: 510px){
    flex-direction: column;
  }
`;

const EventPage = () => {
  const { isLogin, me, setMe, setIsLogin } = useUserNEvent();
  const navigate = useNavigate();
  const { Text } = Typography;
  const [ isProfileOpen, setIsProfileOpen ] = useState(false);
  const [ isEditingOpen, setIsEditingOpen ] = useState(false);
  const [ datas, setDatas ] = useState([]);
  const [ profile, setProfile ] = useState({});
  const [ editBefore, setEditBefore ] = useState({});
  const [ editAfter, setEditAfter ] = useState({});
  const [ filter, setFilter ] = useState("");
  const [ searchValue, setSearchValue ] = useState({date:"", host:"", place:""});
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isProfileLoading, setIsProfileLoading ] = useState(false);
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY/MM/DD";
  const format = "HH:mm";
  
  const getProfile = async(email) => { 
    // get profile data of certain user
    setIsProfileLoading(true);
    const {
      data: { msg, newprofile },
    } = await axios.get("/users/profile", {
      params: { email },
    });
    // message.success(msg);
    setProfile(newprofile);
    setIsProfileLoading(false);
  }

  const userNameBtn = (email) => {
    getProfile(email);
    // setProfile(fakeProfile) // just for testing
    setIsProfileOpen(true);
  }

  const fakeProfile = {
    email: "aaa@aaa.aaa",
    name: "A",
    avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABNCAYAAADjCemwAAAAAXNSR0IArs4c6QAADqRJREFUeF7tnAtUVMcZx/+zvOUtD6liXFgMUrVJk4IQU2Piq8Zo1JjaiFqjJxrtsT5BtFrS1MRobBIbj6lpm2ONAoqgIJrGVE2igIBibBJRfGAUUdwFoiIi3Hun5xvYZVdeC7sgFOecPVe5M99887vfzNz5vpnL8ICSRqMJkmU8yRn6M7BHATwCwA9AQAMqFQG4wYFCxvgFKDjNmM03BQX52Q9CfdZelarVag/GbMcqwEjG8SwYelmh7nsAvmZgX8gy33f58vnTVpDZrIg2h9YnsO9LTFGmgLGJzWpjcQaWwxlPcLBVbc3Pz9dZLK4RAW0Czd/f38nW1mk+mDIXYOq2Ur4puRz4uwo2GwsKzv7X2vVbHZo6MGg5OKIAeFpb2VbK2wquWnPpUv6ZVpavV8xq0PoEBkUyjjcBBFpLOavK4Xjn0qXzfwCgWCrXYmi9goL8bWW8x4CXLVWmHcrnqxhbcvHiuTRL6rIIWkjIY5PBlE0A626JEu1elrN1eXmnlrW23lZDC+n/s9XgIHNv9+To6AhbW1uL6mXAAVm2mXHixJFrLRXUKmhqddB2MExpaWXWzM8Yg7e3j6UiL4DjlZycjJyWCGoRNPEqYee4G8CopioZOHCAsISTJ7+ply0sLBQnTuRCluUGRfzpjT9i7br1qKioqHd/fEgQUs5cAOdc3COLc3V1M+SbP/93eHH8i0hKSsZHm/5mUj4pORGb//YxZrz6WyxatATF14vF/TCb7tKfHAaM9v7ynf+YC85saLXA9gMY2pzwD//6Abp164az+flYt269SfaBAwagtKwUL44bh00fmTZMrVZj5IjhuF5cjNTUvSblHvPzwb8mjoasKAj7eDtkhYsH4+lZN5wOHz4MMctrhqrhw0aalN+2/VNMjZyGzZs/wh9j3zBAW2LfDyNs/SR4u47x2rX8QHNto/tmQ1MHBP27OQvTVzhkyC9hb2+PgwcPGaxCf2/N26tFYxVFwbKYFSY69unTB1qtFkOHPoP9+z8zuedqb49Pxo/CudIyrPjP0QYt7cAX/8ahg4fx7HNDMWrkaJPyCQlxWLhwMd56ezVWrPiDAdoY256Yb/8oXN6KlOTc80O7zX8xvTlwZkHrCGPY/Q2hMc3Lyxt0tTTNsQ/CBFt/VHG56M9Vec9sykw935TMZmsMDu6/muPBzJKNKU5WTOOZNYA1UEdmTnbGU62GFho6eDIYT7D0SXbC8v/Iyc54rTG9G7W0QYMG+Svc5hSAzvXiaqUnxBmfdTwr85OGxDUK7RdhT+3sJEsjK2GqJ+aWisn9s7KyCuuNpw3VGBo6OBKMb2srbTqNXIZtOVkZ08yDFvbUhQ7rrWhn4lxhzx8/nm7y/lOve4YOGrwcnL/dzrp13Oo4S8/JSX/aWEETaBEREU6SzK52IAdih4DJwH+dnZ2ZqFfGBNqwYaOiObC2Q2jagZRgwNGDBz//ZYPQ5s1fUKAoXC0rMqAooKsiy0hLTelATXhgqjyn0+kOU+0GS1uwOOolWZZ30ZqQYHFZAeey8Eak7iHHRpdP23Q6nZhJDdAWLo1OUhRloiIrUGotjK4ELWV3cpcnVgvATafT3RbQFsbGeqju3iujrsjJ0mTZ0DXpb7uTkx5CIwtj7FWtVrtFQHN0dJzGga3ggLOLM6ZO+20NOFkSLpzkXYaJo0vDY4zt1mq1E/Xd81MAU/VEFixaIqCJ7ilJSOqC0FJSUjB9+nRER0djw4YNuHHjBuGp0Ol0znpotL4y7K1YuHipmDVpQiB4u3bu6JIW9t133wlo+/eTw7omMcaeIWhBAM4ZU1m8JMrQPQlaYheEtnr1aiQmJmLu3LlYtmwZbt68KRBxzmMI2mQAJj6zJUujRdeUJEnA27mj67nUyCVP7a+1LoPbnnOeSND+DGClsaUtjYqutbSa7rkjIb5Lds9GGp3HgoODE86ePUvWZkhR0cvqoEkSEh5CM8YjsS1btmSo1eqI6upqjBgxQtyMXhYDWap55SBLi4+Pe2hpRgSYj4/PRRcXl4A5c+YgJiZG3Fq2bLkBGPXrh9BMbYbGtJpwtVGKIWi172iSLCMubvtDSzO2tIagLY8hS6ubPbcbQXN2dsa9e/fg6ekpArv3J41GgwsXyPHbfPLw8BAzVHl5OSIiIpCZmdl8odrtCD169MDt27eFnq6urigsrOfKN0tWazI1aGkr9NBqwRlDCwsLE9PvtGnTEB8fD4Lk4OAg/kbbCvbt2weKlF+9ehUhISHIzs4GjZdBQUE4d+4cQkNDRSOzsrLg4uIiyvr6+oIeBsUzy8rKxEO5cuUKBg4cKK5UnpZzX331FaZOnYpDhw5h5cqVQh5B69evH15//fXWtL9VZZivry+vqqrCjz/+aBBgDI2WUduMLI2g0fIiNjYWkyZNEkr3799fNJZkUCPT09PFS6GNjQ0OHz4srKm4uBg9e/YElQ8MDMSqVavg5eWFKVOmICMjA2PHjhWbXggQvYEPGTIEaWlp8Pb2xunTp+Hu7i4scsKECdi4cSM2b94s6rp79y769u3bvtA0Gg2nBpeWltaDJrqoLGHb9paPaRT93rRpk5hcqFHHjx9v9qnOmDEDW7ZsaTYfgdTp6jZvE+Cvv/662XLWykDdk2ICPfUC/Xr4YdbMmQKWWBFIsomlWaviziyHrX37nZOyIj9e4woy/RG4mu758D3N+CGzKVHb9yqcv0ADraJw2KESjzhcRvH1QjHmPIRWv09Q9/wAwAL9LTt7R7w8911cyonHo337wt3NDdvjH649jdBdJWizAWw25vmb32/E5Zw4MYATtDijtafsHICbYXHgzK4zD0st1p1V30L3I8+RP+0LghYGIMtYyq/nf4grtdDc3NyQYOQaKg+Jxb2fjG1xpf8PBTxPLYCqJH2d3nNbCcBB37BJv/srCk/EoW9QXxC0HUZOyK4MzePbpVDdOPySHtrnAAw7e1+atwFXT8RDE6SBu5s7dibuNBiKtaCpfWzR090G+deqobtTc/ImXOOA7y5XQWGArACSwjF7qAviMitQXqlA5oCDLcOepT4Ys/aG+He1zGFvy0QssqKaw0bFxISm1Oal+052DHeq6i2xW2z8BM2h7KivHhodAFunlzJx7gc10DQaYWm7knbVQfvpG7jn90KLK7y/wNPBjlj4K1es2FGG/Os1HtLIp50x7udOuFoio4+vDYpvchy7WAmNpx2WTHRD4rE7WPRJGVZN8MDWo+UY96QTxv7CCddKZBzNr8LjfewQHuyAKyUSHvG1RcF1CVuPlGNSqDMWbS3F+Rs19bQ2eX67NLM0b9dTemg/BfC9Xtj41983QKOJIMko7lluJWhhGgecu1aNVRPc8elX5ThZWI2hIY4IC7TH1i/LIdswPBPsgNIKBc8GO8LdRYXk7Apc1EqYM8wVW768jdnPuaKsQkHuuXvILaoW+Z3tGH4eYI//XqmGazcVvr1chcd72+OfX5bjx0rLzpJ5fLtkZVle0lvGG2DoaHMogRs/5z0UkqUFauDq5oY9e+oi7NaCFuBbc0znN6Hd8P7nt1EpWd59WmtB5pbz/D6qf+n3iaeNoS0G8BcSMG72X1CUm4CAgAC4ubohJXWP1bunuYp2oHzpfKda7FMzhuYNQDjIxr62vhZaoHDj7N1bt2tI6h6Om49tAJhNB2pP26uikitnyUn9xMbl+3dCfgzgtRdmrUfRyXgEBBA0N6Slde2tVoyxEq1WS0Yl0v3Qfgbg1BiClkvQAgS0fftS2/5RduAaGGMrtVrtW41Bo7//a8zMd6cXnUyAWk3QXLF/v+nhrg7cPqurxjkvcXJy6l1YWHi3KWghz89897QxtM/ug0bxAfKwdoXEGFtaUFAgJsimoOH5mevXFJ2Mj9FbmjE08v+fOkUHWbpEOiVJ0uP3t7TBEyuxsbGqlNS0PHVAwKM0pn1mNKb5+PiIgEZXSJzz52VZNj1D2dR5zyeeeOKFPgFBe8WYZjR7dhVonPMPZVn+fUPG0eTRxYmTJq91c3WNTttb93JrLWivvPIKCgoKkJ+fL7YxUaSKgiUqlUqsd0ePHo3k5GQR4aI6KcZKeShiRW558ir/8MMP4hoeHo6DBw+isrISfn5+uHXrFiim6uTkhKKiIlC0Tb8DyMwekitJ0pON5W0SGhWaOWv256kpyQYPiLWgUaySQnx0pRCdv7+/CPNRY48ePSrChAcOHBCNJjAU4qP7FCulfWN07d27twBNgebc3FwMGjTIsI/s2LFj4kg4BZVJZ4qVmpkkxlh4dXX1iVZDmz179k+Sk5OPANCQEGtBoxmYLIP2gdGVgsZkEWRFFDQmoBTTpP+T9VCYkSyHZu07d+4YAtQEhsrZ2dkJa6KgNf0o4Ewy6EfyyPrMSZzzSFmWm4wkNWtpVJGXl1coYywDgK21oJnTgAeQJ0qSJNMvFTSghFnQasENZ4x91qNHD9uzZ88+gPa0eZVvSpIUa04tZkMjYd27dx/p4eGxz8nJyZa61P9L4py/efHiRbOAUZtbBI0K+Pr6DlYUhfzfhqh8J4cXpdPpmu2Sxm1sMbTayYB2hG/lnEd0YmD0CZrpOp2uxdsHWgVND8rb21u4kjohuFyK9+p0ukZfK5pqk0XQaq3uVc45RenrPvrTgSnSm35JSUmDb/rmqm0xtNoJwl+lUq0xPipkrgLtmO8UY2yFVqutO37SysqtAk1ft4+Pz2jOOX1TbXAr9bF6MfK6cs7X6HQ6E/eOJRVZFZoRvJc559QFTA7MW6JoS8sSLADvOzg4vGfsQGypnIbytwk0fUXTp09/Njw8fKaHh8fUHTt2CPd5r169xJbSyMhIsURau3atWFNaMaUzxj7RarUNfr3FGvW0KTS9gmfOnHGdN28eHfcet379+lGTJ0/uRuvJa9euiXWnpV5gxhhtC98ny/Lu0tLSNv+qcrtAu//p+vj4DAkODo7Iy8t7kjE2AAB9u9vcmGAhY+w05/wbznmWnZ3dkevXr9ffm28Nk2pExv8A9pM2FTH4omgAAAAASUVORK5CYII=",
    intro: "hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,hiiiiiiii,"
  }

  const get_datas = async() => {
    let data = await axios.get("/games", {
      params: { isFuture: true },
    });
    setDatas(data.data);
  }

  useEffect(()=>{
    // setIsLoading(true);
    async function fetchData() { 
      await get_datas();
      setIsLoading(false);
    } 
    fetchData();
  },[])

  const combine_time = (startTime, endTime) => {
    let time = startTime+"-"+endTime;
    return time;
  }

  const handleJoin = async (eventId, userEmail) => {
    console.log(eventId, userEmail); 
    const {
      data: { status, msg },
    } = await axios.post("/games/join", {
      id:eventId,
      email:userEmail
    });
    if(status)
    {
      if(searchValue.date) searchByDate();
      else if(searchValue.host) searchByHost();
      else if(searchValue.place) searchByPlace();
      else get_datas();
      message.success(msg);
    }
    else message.error(msg);
  }

  const handleCancel = async (eventId, userEmail) => {
    console.log(eventId, userEmail); 
    const {
      data: { status, msg },
    } = await axios.post("/games/cancel", {
      id:eventId,
      email:userEmail
    });
    if(status)
    {
      if(searchValue.date) searchByDate();
      else if(searchValue.host) searchByHost();
      else if(searchValue.place) searchByPlace();
      else get_datas();
      message.success(msg);
    }
    else message.error(msg);
  }
  const handleEdit = async() => {
    // TODO: update event info to editAfter in DB
    const {
      data: { status, msg },
    } = await axios.post("/games/edit", {editAfter});
    if(status)
    {
      if(searchValue.date) searchByDate();
      else if(searchValue.host) searchByHost();
      else if(searchValue.place) searchByPlace();
      else get_datas();
      message.success(msg);
    }
    else message.error(msg);
    setIsEditingOpen(false);
  }
  
  const editCheck = () => {
    if (editBefore === editAfter) {
      message.error("Event is not edited");
    } else if (editAfter.place === "") {
      message.error("'Place' is empty.");
    } else if (editAfter.numberLeft === "") {
      message.error("'Open positions' is empty.");
    } else if (parseInt(editAfter.numberLeft) < 0) {
      message.error("Open positions should be more than 0.");
    } else {
      handleEdit();
    }
  }

  const searchByDate = async() => {
    // TODO: use searchValue (it's in date format) to get datas
    let data = await axios.get("/games", {
      params: { isFuture: true, date:searchValue.date },
    });
    setDatas(data.data);
  };

  const searchByHost = async() => {
    // TODO: use searchValue (it's a normal string) to get datas
    let data = await axios.get("/games", {
      params: { isFuture: true, host:searchValue.host },
    });
    setDatas(data.data);
  };
  
  const searchByPlace = async() => {
    // TODO: use searchValue (it's a normal string) to get datas
    let data = await axios.get("/games", {
      params: { isFuture: true, place:searchValue.place },
    });
    setDatas(data.data);
  };

  /*const datas = [
    {
      id:"s89f78s9af7d89a",
      date: "2022.12.30",
      time: "4:00-6:00 pm",
      place: "NTU gym",
      host: "Anne",
      participants: "Mary, Peter, Amy, Daniel",
      numberLeft: "2",
      note: "Please bring your student ID card.",
    },
  ];*/
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 20px'}}>
        <Button 
          type="link" 
          onClick={() => navigate("/pastevents")}>
          Events in the past
        </Button>
        <Space direction="vertical">
          <Select
          defaultValue="Search"
          style={{ width: 138 }}
          onChange={ (value) => {
            setFilter(value);
            if (value === 'By Date') {
              setSearchValue(new Date().toISOString().split`-`.join`/`.slice(0,10))
            } else if (value === 'All events') {
              get_datas();
              setSearchValue("");
            } else {
              setSearchValue("");
            }
          }}
          options={[
            { value: 'By Date', label: 'By Date' },
            { value: 'By Host', label: 'By Host' },
            { value: 'By Place', label: 'By Place' },
            { value: 'All events', label: 'All events' },
          ]}
          />
          { filter === 'By Date' ? 
            <>
              <DatePicker
                defaultValue={dayjs(new Date().toISOString().split`-`.join`/`.slice(0,10), dateFormat)} 
                format={dateFormat}
                onChange={(date, dateString) => { 
                  setSearchValue({date:dateString, host:"", place:""});
                }}
              />
              <Button 
                type="primary" 
                onClick={searchByDate}
                style={{width: '138px'}}>
                Search
              </Button>
            </>
          : <>
              { filter === 'By Host' ? 
              <>
                <Input
                  style={{width: '138px'}}
                  placeholder="Host name"
                  onChange={(e) => {
                    setSearchValue({date:"", host:e.target.value, place:""});
                  }}
                />
                <Button 
                  type="primary" 
                  onClick={searchByHost}
                  style={{width: '138px'}}>
                  Search
                </Button>
              </>
              : 
              <>
                { filter === 'By Place' ? 
                <>
                  <Input
                    style={{width: '138px'}}
                    placeholder="Place"
                    onChange={(e) => {
                      setSearchValue({date:"", host:"", place:e.target.value});
                    }}
                  />
                  <Button 
                    type="primary" 
                    onClick={searchByPlace}
                    style={{width: '138px'}}>
                    Search
                  </Button>
                </>
                : <></>} 
              </>} 
            </>}
        </Space>
      </div>
      <Wrapper>
        { isLoading ? <Text style={{ marginLeft: 45 }}>Loading...</Text> : <>
        { datas.length === 0 ? 
        <Text style={{ marginLeft: 45 }}>No event.</Text>
        : <>
        {datas.map((data, i) => {
          return (
            <Card
              key={i}
              style={{
                width: 300,
                marginLeft: 30,
                marginTop: 15
              }}
            >
              <p>Date: {data.date}</p>
              <p>Time: {combine_time(data.startTime, data.endTime)}</p>
              <p>Place: {data.place}</p>
              <p>Host: {data.host.username}</p>
              <div style={{display: 'flex', flexWrap: 'wrap', width: '250px'}}>
                  <p style={{marginRight: '5px'}}>Participants:</p>
                  {data.participants.map((participant, j) => 
                    <p 
                    key={j}
                    style={{color: 'cornflowerblue', marginRight: '5px', cursor: 'pointer'}}
                    onClick={() => {
                      userNameBtn(participant.email)
                    }}>
                    {participant.username}{","}
                    </p>
                  )}
              </div>
              <p>Number Left: {data.numberLeft}</p>
              {data.notes === "" ? 
                <p style={{visibility: "hidden"}}>Note: {data.notes}</p>
                :
                <p>Note: {data.notes}</p>
              }
              {isLogin ?
                <Space>
                  {data.numberLeft === 0 ?
                  <Tooltip placement="bottom" title='No available position now'>
                    <Button 
                    disabled
                    type="primary" 
                    onClick={() => {
                      handleJoin(data.id, me);
                    }}>Join</Button>
                  </Tooltip>
                  :
                  <Button 
                    type="primary" 
                    onClick={() => {
                      handleJoin(data.id, me);
                    }}>Join</Button>
                  }
                  <Button 
                    onClick={() => {
                      handleCancel(data.id, me);
                    }}>Cancel</Button>
                  { data.host.email === me ? 
                  <Button 
                    onClick={() => {
                      setEditBefore(data);
                      setEditAfter(data);
                      setIsEditingOpen(true);
                    }}>Edit</Button>
                  : <></>}
                </Space> 
                : <Text mark>
                    To join the event, please <span style={{cursor: 'pointer', color: 'cornflowerblue'}} onClick={() => navigate("/login")}>log in</span> or <span style={{cursor: 'pointer', color: 'cornflowerblue'}} onClick={() => navigate("/register")}>register</span> first.
                  </Text>}
            </Card>
          );
        })}</>}
        </>}
        <Modal 
          title="Profile" 
          open={isProfileOpen} 
          footer={null}
          onCancel={() => {
            setIsProfileOpen(false);
        }}>
          {isProfileLoading ? <Text style={{ marginLeft: 45 }}>Loading...</Text> : 
          <ProfileWrapper >
            { profile.avatar ? 
            <img style={{height: '100px', width: '100px', marginRight: '15px', marginBottom: '15px'}} src={profile.avatar}/>
            : <Avatar size={100} style={{marginRight: '15px'}} icon={<UserOutlined />} />}
            <Space
              direction="vertical"
              size="small">
              <TextWrapper>
                <Text strong style={{marginRight: '5px'}}>Email</Text>
                <Text >{profile.email}</Text>
              </TextWrapper>
              <Space>
                <Text strong>Name</Text>
                <Text >{profile.name}</Text>
              </Space>
              <TextWrapper>
                <Text strong style={{marginRight: '5px'}}>Intro</Text>
                <Text >{profile.intro}</Text>
              </TextWrapper>
            </Space>
          </ProfileWrapper>}
        </Modal>
        <Modal 
          title="Edit event" 
          open={isEditingOpen} 
          onCancel={() => {
            setIsEditingOpen(false);
          }}
          onOk={editCheck}>
          <Space 
            direction="vertical" 
            size="small">
            <Space>
              <Text>Date</Text>
              <DatePicker
                value={dayjs(editAfter.date, dateFormat)} 
                format={dateFormat}
                onChange={(date, dateString) => { //
                  setEditAfter({...editAfter, date: dateString});
                  console.log(editAfter);
                }}
              />
            </Space>
            <Space>
              <Text>From</Text>
              <TimePicker
                minuteStep={10}
                value={dayjs(editAfter.startTime, format)}//
                format={format}
                onSelect={(time) => {
                  setEditAfter({...editAfter, startTime: dayjs(time).format("HH:mm")});
                  console.log(editAfter);
                }}
              />
              <Text>To</Text>
              <TimePicker
                minuteStep={10}
                value={dayjs(editAfter.endTime, format)}
                format={format}
                onSelect={(time) => {
                  setEditAfter({...editAfter, endTime: dayjs(time).format("HH:mm")});
                  console.log(editAfter);
                }}
              />
            </Space>
            <Space>
              <Text>Place<span style={{color: 'red'}}>*</span></Text>
              <Input
                style={{width: 275}}
                placeholder="Where is this event held?"
                value={editAfter.place}
                onChange={(e) => {
                  setEditAfter({...editAfter, place: e.target.value});
                }}
              />
            </Space>
            <Space>
              <Text >Open positions<span style={{color: 'red'}}>*</span></Text>
              <Input
                type='number'
                style={{width: 213}}
                placeholder="How many positions left?"
                value={editAfter.numberLeft}
                onChange={(e) => {
                  setEditAfter({...editAfter, numberLeft: e.target.value});
                }}
              />
            </Space>
            <Space>
              <Text>Note</Text>
              <Input
                style={{width: 285}}
                placeholder="Any other infomation?"
                value={editAfter.notes}
                onChange={(e) => {
                  setEditAfter({...editAfter, notes: e.target.value});
                }}
              />
            </Space>
          </Space>
        </Modal>
      </Wrapper>
    </div>
  );
};

export default EventPage;
