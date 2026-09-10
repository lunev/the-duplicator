import { ChatBubbleIcon } from '@radix-ui/react-icons';

import FloatingPopup from '@/components/floating-popup/FloatingPopup';
import { SUPPORT_URL } from '@/constants';

const SupportPopup = () => (
  <FloatingPopup
    storageKey="supportPopupDismissedAt"
    intervalDays={14}
    icon={<ChatBubbleIcon className="mt-0.5 size-3.5 shrink-0" />}
    messages={['Have a question?', 'Got a suggestion for us?', 'Ran into a problem or bug?']}
    linkText="Get support here"
    linkHref={SUPPORT_URL}
  />
);

export default SupportPopup;
