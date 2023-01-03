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
  const { Text, Link } = Typography;
  return (
    <FooterWrapper>
      <Divider />
      <Text>
          Contact us if you have any question: 
      </Text>
      <Link href="mailto:playminton@gmail.com">
        playminton1111@gmail.com
      </Link>
      <Divider />
    </FooterWrapper>
  )
};

export default Footer;