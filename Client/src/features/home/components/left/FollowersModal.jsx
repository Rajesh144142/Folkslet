import { Modal } from '@mantine/core';

import UserSuggestion from '../shared/UserSuggestion';

const modalStyles = {
  content: {
    borderRadius: '24px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
    overflow: 'hidden',
  },
  body: {
    padding: 0,
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-base)',
    fontFamily: 'inherit',
  },
  header: {
    margin: 0,
    padding: '20px 24px',
    borderBottom: '1px solid var(--color-border)',
    color: 'var(--color-text-base)',
    fontWeight: 600,
    fontSize: '1rem',
    textAlign: 'center',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-text-base)',
  },
  close: {
    color: 'var(--color-text-muted)',
    '&:hover': {
      color: 'var(--color-primary)',
    },
  },
};

const FollowersModal = ({ isOpen, onClose, people }) => (
  <Modal
    overlayProps={{ opacity: 0.35, blur: 12, color: 'rgba(15, 23, 42, 0.35)' }}
    radius="lg"
    size="lg"
    opened={isOpen}
    onClose={onClose}
    centered
    styles={modalStyles}
    title="People you may know"
  >
    <div className="flex max-h-[32rem] flex-col gap-4 overflow-y-auto p-6">
      {people.map((person) => (
        <UserSuggestion key={person._id} person={person} />
      ))}
    </div>
  </Modal>
);

export default FollowersModal;

