import { styled } from "../../../../../styled-system/jsx";
import { ContainerFluid } from "./container-fluid";

export const Container = styled(ContainerFluid, {
  base: {
    maxWidth: {
      xs: "540px",
      sm: "720px",
      md: "960px",
    },
  },
});
