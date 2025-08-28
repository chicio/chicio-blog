import {Colors} from "@/types/styled";

// Matrix Color Palette (WCAG Compliant)
export const matrixPrimaryGreen = "#00FF41";      
export const matrixNeoGreen = "#39FF14";          
export const matrixDarkGreen = "#003D10";         
export const matrixTextGreen = "#00CC33";         
export const matrixBackgroundDark = "#001100";    
export const matrixBackgroundLight = "#002200"; 
export const redPill = "#ff2a2a";
export const bluePill = "#33aaff";

export const matrixColors: Colors = {
  primaryColor: matrixPrimaryGreen,
  secondaryColor: matrixTextGreen,
  primaryColorDark: matrixDarkGreen,
  primaryColorLight: matrixNeoGreen,
  generalBackground: matrixBackgroundDark,
  textAbovePrimaryColor: "#000000",
  primaryTextColor: "#E8FFE8",
  secondaryTextColor: matrixTextGreen,
  accentColor: matrixNeoGreen,
  generalBackgroundLight: matrixBackgroundLight,
  boxShadowLight: "rgba(0, 255, 65, 0.3)",
  dividerColor: matrixTextGreen,
  confirmColor: redPill,
  undoColor: bluePill,
};
