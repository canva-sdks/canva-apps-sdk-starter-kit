import {CheckIcon, XIcon } from "@canva/app-ui-kit";
import React from 'react';
import styles from 'styles/components.css';

type PillProps = {
  variant: 'Pass' | 'Fail';
  children: React.ReactNode;
};

export const Pill: React.FC<PillProps> = ({ variant, children }) => {
  const className = `${styles.pill} ${styles[variant]}`;
  const Icon = variant === 'Pass' ? CheckIcon : XIcon;

  return (
    <div className={className}>
      <Icon></Icon>
      <span>{variant}</span>
    </div>
  )
};
