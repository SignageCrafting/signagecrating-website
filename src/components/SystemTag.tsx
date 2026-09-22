import React from 'react';

interface SystemTagProps {
  status: string;
}

const SystemTag = React.memo(function SystemTag({ status }: SystemTagProps) {
  return (
    <span
      className="font-mono font-bold text-[0.75rem] tracking-widest uppercase animate-pulse-tag"
      style={{ color: 'var(--accent)', opacity: 0.8 }}
    >
      [ SYS_STATUS: {status} ]
    </span>
  );
});

export default SystemTag;
