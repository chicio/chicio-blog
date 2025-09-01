'use client'

import { styled } from "../../../../../styled-system/jsx";


// export const ContainerFluid = styled.div`
//   width: 100%;
//   padding-right: 15px;
//   padding-left: 15px;
//   margin-right: auto;
//   margin-left: auto;
// `;


export const ContainerFluid = styled("div", {
  base: {
    width: "100%",
    paddingLeft: "15px",
    paddingRight: "15px",  
    marginLeft: "auto",  
    marginRight: "auto",  
  },
});