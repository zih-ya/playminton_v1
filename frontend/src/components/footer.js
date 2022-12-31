import React from 'react';
import { Typography, Divider } from 'antd';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Footer = () => {
  const { Text } = Typography;
  return (
    <FooterWrapper>
      <Divider />
      <Text>
          Contact us if you have any question: [xxxx@gmail.com]
      </Text>
      <Divider />
    </FooterWrapper>
  )
};

export default Footer;