import React from 'react';
import 'typeface-roboto';
import styled from 'styled-components';

const FootPane = () => (
    <Wrapper>
        <Footer>
            <Icon
                src="/img/gg-logo.png"
                alt="Global Good"
            />
            <Copyright>
                &copy; 2019 globalgood All Rights Reserved.
            </Copyright>
        </Footer>
    </Wrapper>
)

const Copyright = styled.div`
    font-size: 0.75em;
`;
const Wrapper = styled.div`
    width: 100%;
    background-color: white;
    display: flex;
    align-content: center;
    height: 50px;
`;
const Footer = styled.div`
    margin: 0 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;
const Icon = styled.img`
    height: 30px; 
`;

export default FootPane;
