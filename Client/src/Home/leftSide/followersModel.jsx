import React from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import FollowersCard from './followCard';

const FollowersModal = ({ modalOpened, setModalOpened }) => {
  const theme = useMantineTheme();
  return (
    <Modal
      overlaycolor={
        theme.colorScheme === 'dark'
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayopacity={0.55}
      overlayblur={3}
      size="55%"
      
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <FollowersCard location="modal" />
    </Modal>
  );
};

export default FollowersModal;
