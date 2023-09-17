import React from 'react';
import { useMantineTheme, Modal } from '@mantine/core';
import PostShare from '../middle/postshare';

const ShareModal = ({ modalOpened, setModalOpened }) => {
  const theme = useMantineTheme();

  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
      size="lg" // Adjust the size as needed
    >
      <div className=""> {/* Add your desired styling */}
        <PostShare location="model"/>
      </div>
    </Modal>
  );
};

export default ShareModal;
