import styled from 'styled-components';

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 100vh;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }
`;