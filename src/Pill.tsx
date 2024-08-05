import {CheckIcon, XIcon } from "@canva/app-ui-kit";
import React from 'react';
import styles from 'styles/components.css';

type PillProps = {
  variant: 'Pass' | 'Fail';
};

export const Pill: React.FC<PillProps> = ({ variant }) => {
  const className = `${styles.pill} ${styles[variant]}`;
  const Icon = variant === 'Pass' ? CheckIcon : XIcon;
  const label = variant === 'Pass' ? "Pass" : "Fail"

  return (
    <div className={className}>
      <Icon></Icon>
      <span>{label}</span>
    </div>
  )
};
