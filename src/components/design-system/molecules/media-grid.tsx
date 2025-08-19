import styled from 'styled-components';
import { mediaQuery } from '../utils/media-query';

export const MediaGrid = styled.div`
  display: grid;
  grid-template-areas: 
    "top-left top-right"
    "bottom-left bottom-right";
  grid-template-columns: 1fr 1fr; /* Two columns */
  grid-template-rows: 1fr 1fr; /* Two rows */
  gap: 16px; /* Space between tiles */
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  overflow: auto; 

  & > div:nth-child(1) {
    grid-area: top-left;
  }

  & > div:nth-child(2) {
    grid-area: top-right;
  }

  & > div:nth-child(3) {
    grid-area: bottom-left;
  }

  & > div:nth-child(4) {
    grid-area: bottom-right;
  }

  ${mediaQuery.maxWidth.md} {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: visible;
  }
`;