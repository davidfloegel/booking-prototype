import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";

const animateUp = keyframes`
  0% {
    opacity: 0;
    bottom: 0;
  }

30% {
  opacity: 1;
  bottom: 85px;
}

60% {
  bottom: 70px;
}

100% {
  bottom: 80px;
}
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
      opacity: 0;
    display: none;
  }
`;

const Msg = styled.div<any>`
  background: #eb4d4b;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  padding: 15px 10px;
  position: absolute;
  bottom: 80px;
  left: 5px;
  right: 5px;
  animation: ${animateUp} 0.1s linear;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ closing }) =>
    closing &&
    css`
      animation: ${fadeOut} 0.1s linear;
      animation-fill-mode: forwards;
    `};
`;

const ErrorMsg: React.SFC<any> = ({ children, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const close = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <Msg closing={isClosing}>
      {children}
      <i className="fa fa-times" onClick={close} />
    </Msg>
  );
};

export default ErrorMsg;
