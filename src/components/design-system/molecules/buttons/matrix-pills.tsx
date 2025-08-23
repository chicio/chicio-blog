'use client'

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FC } from 'react';
import { mediaQuery } from '../../utils/media-query';

const PillContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[6]};
  margin-top: ${(props) => props.theme.spacing[6]};
  position: relative;
  z-index: 13;

  ${mediaQuery.minWidth.sm} {
    flex-direction: row;
  }
`;

const Pill = styled(motion(Link))<{ $color: 'red' | 'blue' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 50px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  
  background: ${(props) => props.$color === 'red' 
    ? 'linear-gradient(145deg, #ff0000, #cc0000)' 
    : 'linear-gradient(145deg, #0066ff, #0044cc)'};
  
  color: white;
  border: 2px solid ${(props) => props.$color === 'red' ? '#ff0000' : '#0066ff'};
  
  box-shadow: 
    0 4px 15px ${(props) => props.$color === 'red' ? '#ff000050' : '#0066ff50'},
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 8px 25px ${(props) => props.$color === 'red' ? '#ff000070' : '#0066ff70'},
      0 0 20px ${(props) => props.$color === 'red' ? '#ff000040' : '#0066ff40'},
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

const PillLabel = styled.div`
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

interface MatrixPillsProps {
  redPillHref: string;
  bluePillHref: string;
  redPillText?: string;
  bluePillText?: string;
}

export const MatrixPills: FC<MatrixPillsProps> = ({
  redPillHref,
  bluePillHref,
  redPillText = "Red Pill",
  bluePillText = "Blue Pill"
}) => {
  return (
    <PillContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
    >
      <Pill
        $color="red"
        href={redPillHref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <PillLabel>{redPillText}</PillLabel>
      </Pill>
      
      <Pill
        $color="blue"
        href={bluePillHref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <PillLabel>{bluePillText}</PillLabel>
      </Pill>
    </PillContainer>
  );
};
