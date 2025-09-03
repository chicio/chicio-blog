import { Container } from "@/components/design-system/atoms/containers/container";
import { glowContainer } from "@/components/design-system/atoms/effects/glow";
import { InputField } from "@/components/design-system/atoms/typography/input-field";
import { paragraphStyle } from "@/components/design-system/atoms/typography/paragraph";
import { mediaQuery } from "@/components/design-system/utils/media-query";

import { ChangeEvent, FC, FormEvent } from "react";
import { BiSend } from "react-icons/bi";
import styled from "styled-components";

const InputContainer = styled(Container)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${(props) => props.theme.spacing[2]};
  z-index: 100;
  display: flex;
  justify-content: center;

  ${mediaQuery.minWidth.sm} {
    padding: ${(props) => props.theme.spacing[3]};
  }
`;

const InputWrapper = styled.form`
  position: relative;
  width: 100%;
`;

const ChatInputField = styled(InputField)`
  ${paragraphStyle};
  ${glowContainer};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[8]} ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[3]};

  &:disabled {
    cursor: not-allowed;
  }

  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[1]}
      ${(props) => props.theme.spacing[7]} ${(props) => props.theme.spacing[1]}
      ${(props) => props.theme.spacing[2]};
  }
`;

const SendButton = styled.button`
  position: absolute;
  right: ${(props) => props.theme.spacing[1]};
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: ${(props) => props.theme.colors.primaryColor};
  color: ${(props) => props.theme.colors.textAbovePrimaryColor};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.colors.primaryColorDark};
    transform: translateY(-50%) scale(1.05);
  }

  &:disabled {
    background: ${(props) => props.theme.colors.secondaryColor};
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  ${mediaQuery.maxWidth.sm} {
    width: 32px;
    height: 32px;
    right: ${(props) => props.theme.spacing[0]};
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
        <BiSend size={16} />
      </SendButton>
    </InputWrapper>
  </InputContainer>
);
