import {Colors} from "@/types/styled";

// Matrix Color Palette - Dark Theme Only (WCAG Compliant)
export const matrixPrimaryGreen = "#00FF41";      // Matrix green classico
export const matrixNeoGreen = "#39FF14";          // Highlight/CTA verde brillante
export const matrixDarkGreen = "#003D10";         // Verde scuro per backgrounds
export const matrixTextGreen = "#00CC33";         // Verde per testi leggibili
export const matrixBackgroundDark = "#001100";    // Background principale nero-verde
export const matrixBackgroundLight = "#002200";   // Background secondario più chiaro
export const redPill = "#ff2a2a";
export const bluePill = "#33aaff";


// Single Matrix Dark Theme
export const matrixTheme: Colors = {
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
<<<<<<< HEAD
  confirmColor: redPill,
  undoColor: bluePill,
=======
  
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
};

export const blogDark = matrixTheme;
export const blogLight = matrixTheme; // Same as dark now
