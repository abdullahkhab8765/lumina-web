'use client';

import React, { useEffect, useRef } from 'react';
import styles from './MessageCard.module.css';
import {
  createMessageCardEnterTimeline,
  createMessageCardExitTimeline,
} from '../../animations/messageTimeline';
import { splitMessageParagraphs } from '../../utils/scene3Helpers';
import type { Gift } from '../../types/scene3';

interface MessageCardProps {
  gift: Gift;
  giftIndex: number;
  onClose: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ gift, giftIndex, onClose }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const paragraphs = splitMessageParagraphs(gift.message);

  useEffect(() => {
    isClosingRef.current = false;
    const tl = createMessageCardEnterTimeline(cardRef.current);

    return () => {
      tl.kill();
    };
  }, [giftIndex]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    createMessageCardExitTimeline(cardRef.current, onClose);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Gift ${giftIndex + 1} message`}
    >
      <div ref={cardRef} className={styles.card}>
        <div className={styles.cardGlow} aria-hidden="true" />
        <div className={styles.cardContent}>
          {paragraphs.map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <button type="button" className={styles.continueButton} onClick={handleClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default MessageCard;