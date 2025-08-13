import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { paragraphStyle } from "@/components/design-system/atoms/paragraph";
import { Send } from "@styled-icons/boxicons-regular";
import { ChangeEvent, FC, FormEvent } from "react";

const InputContainer = styled.form`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.spacing[3]};
  background: rgba(251, 251, 251, 0.5);
  border-top: 1px solid ${(props) => props.theme.light.dividerColor}20;
  z-index: 100;

  display: flex;
  justify-content: center;

  background: linear-gradient(
    90deg,
    transparent,
    ${(props) => props.theme.light.primaryColor}30,
    transparent
  );

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to top,
      rgba(251, 251, 251, 0.99) 0%,
      rgba(251, 251, 251, 0.9) 30%,
      rgba(251, 251, 251, 0.7) 60%,
      rgba(251, 251, 251, 0.3) 80%,
      rgba(251, 251, 251, 0.1) 100%
    );
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    pointer-events: none;
    z-index: -2;
  }

  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[2]};
  }

  ${mediaQuery.dark} {
    background: rgba(33, 34, 33, 0.6);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border-top-color: ${(props) => props.theme.dark.dividerColor}20;

    &::before {
      background: linear-gradient(
        to top,
        rgba(33, 34, 33, 0.99) 0%,
        rgba(33, 34, 33, 0.9) 30%,
        rgba(33, 34, 33, 0.7) 60%,
        rgba(33, 34, 33, 0.3) 80%,
        rgba(33, 34, 33, 0.1) 100%
      );
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  //backdrop-filter: blur(20px);
  //-webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;

  ${mediaQuery.dark} {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const ChatInputField = styled.input`
  ${paragraphStyle};
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[3]};
  border: 1px solid ${(props) => props.theme.light.dividerColor};
  border-radius: 1.5rem;
  outline: none;
  background: ${(props) => props.theme.light.generalBackground};
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: ${(props) => props.theme.light.primaryColor};
    box-shadow:
      0 0 0 2px ${(props) => props.theme.light.primaryColor}25,
      0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: ${(props) => props.theme.light.generalBackgroundLight};
    cursor: not-allowed;
  }

  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[1]}
      ${(props) => props.theme.spacing[7]} ${(props) => props.theme.spacing[1]}
      ${(props) => props.theme.spacing[2]};
  }

  ${mediaQuery.dark} {
    border-color: ${(props) => props.theme.dark.dividerColor};
    background: ${(props) => props.theme.dark.generalBackground};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    &:focus {
      border-color: ${(props) => props.theme.dark.primaryColor};
      box-shadow:
        0 0 0 2px ${(props) => props.theme.dark.primaryColor}25,
        0 2px 8px rgba(0, 0, 0, 0.4);
    }

    &:disabled {
      background: ${(props) => props.theme.dark.generalBackgroundLight};
    }
  }
`;

const SendButton = styled.button`
  position: absolute;
  right: ${(props) => props.theme.spacing[1]};
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: ${(props) => props.theme.light.primaryColor};
  color: ${(props) => props.theme.light.textAbovePrimaryColor};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.light.primaryColorDark};
    transform: translateY(-50%) scale(1.05);
  }

  &:disabled {
    background: ${(props) => props.theme.light.secondaryColor};
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  ${mediaQuery.maxWidth.sm} {
    width: 32px;
    height: 32px;
    right: ${(props) => props.theme.spacing[0]};
  }

  ${mediaQuery.dark} {
    background: ${(props) => props.theme.dark.primaryColor};
    color: ${(props) => props.theme.dark.textAbovePrimaryColor};

    &:hover:not(:disabled) {
      background: ${(props) => props.theme.dark.primaryColorDark};
    }

    &:disabled {
      background: ${(props) => props.theme.dark.secondaryColor};
    }
  }
`;

export const ChatInput: FC<{
  input: string;
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ input, handleSubmit, handleInputChange }) => (
  <InputContainer onSubmit={handleSubmit}>
    <InputWrapper>
      <ChatInputField
        value={input}
        onChange={handleInputChange}
        placeholder="Ask me anything..."
      />
      <SendButton type="submit" disabled={!input.trim()}>
        <Send size={16} />
      </SendButton>
    </InputWrapper>
  </InputContainer>
);
