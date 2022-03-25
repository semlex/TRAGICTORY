import { css } from "styled-components";

export const sm = (props) => {
   return css`
    @media only screen and (max-width: 576px) {
      ${props}
    }
  `;
};

export const md = (props) => {
   return css`
    @media only screen and (max-width: 768px) {
      ${props}
    }
  `;
};

export const lg = (props) => {
   return css`
    @media only screen and (max-width: 992px) {
      ${props}
    }
  `;
};