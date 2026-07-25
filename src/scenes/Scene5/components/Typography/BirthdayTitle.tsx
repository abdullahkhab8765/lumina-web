'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import styles from './Typography.module.css';
import { TITLE_LINE_1, TITLE_LINE_2 } from '../../config/typographyConfig';

export interface BirthdayTitleHandle {
  line1: HTMLSpanElement | null;
  line2: HTMLSpanElement | null;
}

const BirthdayTitle = forwardRef<BirthdayTitleHandle>((_props, ref) => {
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get line1() {
        return line1Ref.current;
      },
      get line2() {
        return line2Ref.current;
      },
    }),
    []
  );

  return (
    <div className={styles.titleGroup}>
      <span ref={line1Ref} className={styles.titleLine}>
        {TITLE_LINE_1}
      </span>
      <span ref={line2Ref} className={styles.titleName}>
        {TITLE_LINE_2}
      </span>
    </div>
  );
});

BirthdayTitle.displayName = 'BirthdayTitle';

export default BirthdayTitle;