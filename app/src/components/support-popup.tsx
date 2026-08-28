import { ChatBubbleIcon } from '@radix-ui/react-icons';
import FloatingPopup from '@/components/floating-popup';

const SupportPopup = () => (
  <FloatingPopup
    storageKey="supportPopupDismissedAt"
    intervalDays={14}
    icon={<ChatBubbleIcon className="mt-0.5 size-3.5 shrink-0" />}
    messages={['Have a question?', 'Got a suggestion for us?', 'Ran into a problem or bug?']}
    linkText="Get support here"
    linkHref="https://chromewebstore.google.com/detail/the-duplicator/cmbkalfnmgbghjoghgcplcmcijbdijei/support"
  />
);

export default SupportPopup;
