import styled, { keyframes } from "styled-components";

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

export default styled.div`
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
`;
