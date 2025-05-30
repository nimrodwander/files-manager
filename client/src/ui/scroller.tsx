import React, { useRef, ReactNode } from 'react';
import Box from '@mui/material/Box';

interface IScrollWithBottomCallbackProps {
  onReachBottom?: () => void;
  children: ReactNode;
}

export const Scroller: React.FC<IScrollWithBottomCallbackProps> = ({
  onReachBottom,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Check if scrolled to bottom (or very close)
    const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

    if (isAtBottom) {
      onReachBottom?.();
    }
  };

  return (
    <Box
      ref={scrollRef}
      onScroll={handleScroll}
      sx={{
        maxHeight: '80%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#999',
          borderRadius: '3px',
        },
      }}
    >
      {children}
    </Box>
  );
};