import { createContext, useContext, useState, useEffect } from 'react';
import axios from "../api";

const UserNEventContext = createContext({
  isLogin: false,
  me: "",

//   addCardMessage: () => {},
});

const UserNEventProvider = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState("");
  useEffect(() => {
    check_login();
  }, []);
  const check_login = async() => {
    if(document.cookie)
    {
      const {
        data: { newme, newisLogin },
      } = await axios.get("/login", {
        params: { session_token:document.cookie },
      });
      setMe(newme);
      setIsLogin(newisLogin);
    }
  };
//   const addCardMessage = (message) => {
//     setMessages([...messages, makeMessage(message, ADD_MESSAGE_COLOR)]);
//   };

  return (
    <UserNEventContext.Provider
      value={{
        isLogin, setIsLogin,
        me, setMe
        // addCardMessage,
      }}
      {...props}
    />
  );
};

function useUserNEvent() {
  return useContext(UserNEventContext);
}

export { UserNEventProvider, useUserNEvent };
