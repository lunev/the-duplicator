import { Cross2Icon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFloatingPopup } from '@/hooks/useFloatingPopup';
import useTypewriter from '@/hooks/useTypewriter';
import { cn } from '@/lib/utils';

export type FloatingPopupPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

const POSITION_CLASSES: Record<FloatingPopupPosition, string> = {
  'bottom-right': 'bottom-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'top-right': 'top-3 right-3',
  'top-left': 'top-3 left-3',
};

type FloatingPopupProps = {
  storageKey: string;
  intervalDays: number;
  messages: string[];
  linkText: string;
  linkHref: string;
  icon?: ReactNode;
  position?: FloatingPopupPosition;
  className?: string;
};

const FloatingPopup = ({
  storageKey,
  intervalDays,
  messages,
  linkText,
  linkHref,
  icon,
  position = 'bottom-right',
  className,
}: FloatingPopupProps) => {
  const { visible, dismiss } = useFloatingPopup({ storageKey, intervalDays });
  const isAnimated = messages.length > 1;
  const typedMessage = useTypewriter(visible && isAnimated ? messages : []);
  const displayedMessage = isAnimated ? typedMessage : (messages[0] ?? '');

  if (!visible) return null;

  return (
    <Card
      className={cn(
        'fixed z-40 w-64 max-w-[calc(100vw-1.5rem)] shadow-lg',
        POSITION_CLASSES[position],
        className,
      )}
    >
      <Button
        variant="round"
        size="icon-xs"
        className="absolute right-1.5 top-1.5"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        <Cross2Icon className="size-3" />
      </Button>
      <CardContent className="flex items-start gap-3 p-3 pr-8">
        {icon}
        <div className="min-w-0 flex-1">
          <div className="h-5 truncate text-xs">{displayedMessage}</div>
          <a
            href={linkHref}
            target="_blank"
            rel="noreferrer noopener"
            className="text-xs font-medium underline hover:no-underline"
          >
            {linkText}
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default FloatingPopup;
