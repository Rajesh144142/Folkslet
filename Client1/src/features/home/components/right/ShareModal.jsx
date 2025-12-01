import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import SvgIcon from '@mui/material/SvgIcon';
import { forwardRef } from 'react';

import PostComposer from '../middle/PostComposer';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShareModal = ({ isOpen, onClose }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    TransitionComponent={Transition}
    keepMounted
    fullWidth
    maxWidth="sm"
    PaperProps={{
      elevation: 0,
      sx: {
        borderRadius: '24px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
        overflow: 'hidden',
      },
    }}
    slotProps={{
      backdrop: {
        sx: {
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(18px)',
        },
      },
    }}
  >
    <DialogActions
      sx={{
        justifyContent: 'flex-end',
        padding: '12px 16px 0',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <IconButton aria-label="Close share modal" onClick={onClose}>
        <SvgIcon
          sx={{
            fontSize: 20,
            color: 'var(--color-text-muted)',
            '&:hover': { color: 'var(--color-primary)' },
          }}
        >
          <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 0 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z" />
        </SvgIcon>
      </IconButton>
    </DialogActions>
    <DialogContent
      sx={{
        padding: 2,
        pt: 0,
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <PostComposer />
    </DialogContent>
  </Dialog>
);

export default ShareModal;

