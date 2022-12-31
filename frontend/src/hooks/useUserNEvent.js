import { createContext, useContext, useState } from 'react';

const UserNEventContext = createContext({
  isLogin: false,
  me: "",

//   addCardMessage: () => {},
});

const UserNEventProvider = (props) => {
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState("");

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
