'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AmbientWhisper — AIの環境に溶け込む囁き
 *
 * ポップアップやチャットメッセージではなく、空間の変化として表現する。
 * - 3-4秒かけてフェードイン
 * - ユーザーが操作を開始したらフェードアウト
 * - text-gray-400 で環境に溶け込む
 */
export function AmbientWhisper({ message }: { message?: string }) {
  const [visible, setVisible] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (message) {
      // Delay appearance to feel organic
      timerRef.current = setTimeout(() => {
        setDisplayedMessage(message);
        setVisible(true);
      }, 800);
    } else {
      setVisible(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message]);

  // Clear displayed message after exit animation
  const handleExitComplete = () => {
    if (!visible) setDisplayedMessage(null);
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && displayedMessage && (
        <motion.div
          key={displayedMessage}
          className="absolute bottom-4 left-0 right-0 z-20 pointer-events-none
                     flex justify-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 3, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <p
            className="text-gray-700 text-sm
                       select-none max-w-sm text-center"
          >
            {displayedMessage}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
