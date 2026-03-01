// src/components/Modal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      height: '100%',
      maxHeight: '100%',
      borderRadius: 0,
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
}));

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

/**
 * Modal Component
 * @param {Object} props
 * @param {boolean} props.open - Control modal visibility
 * @param {Function} props.onClose - Handler for closing modal
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.children - Modal content
 * @param {string} props.confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} props.cancelText - Text for cancel button (default: 'Cancel')
 * @param {Function} props.onConfirm - Handler for confirm action
 * @param {Function} props.onCancel - Handler for cancel action (default: onClose)
 * @param {boolean} props.confirmLoading - Loading state for confirm button
 * @param {boolean} props.cancelLoading - Loading state for cancel button (if needed)
 * @param {string} props.maxWidth - Dialog max width ('xs', 'sm', 'md', 'lg', 'xl') (default: 'sm')
 * @param {boolean} props.fullScreenOnMobile - Force fullscreen on mobile (default: true)
 * @param {boolean} props.hideCloseButton - Hide the close icon in title (default: false)
 * @param {Object} props.confirmButtonProps - Additional props for confirm button
 * @param {Object} props.cancelButtonProps - Additional props for cancel button
 */
const Modal = ({
  open,
  onClose,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmLoading = false,
  cancelLoading = false,
  maxWidth = 'sm',
  fullScreenOnMobile = true,
  hideCloseButton = false,
  confirmButtonProps = {},
  cancelButtonProps = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreenOnMobile && isMobile}
      disableEscapeKeyDown={confirmLoading} // Prevent closing while loading
      PaperProps={{
        sx: {
          ...(fullScreenOnMobile && isMobile && { borderRadius: 0 }),
        },
      }}
    >
      <StyledDialogTitle>
        <span>{title}</span>
        {!hideCloseButton && (
          <IconButton onClick={onClose} size="small" disabled={confirmLoading}>
            <CloseIcon />
          </IconButton>
        )}
      </StyledDialogTitle>

      <StyledDialogContent dividers={false}>{children}</StyledDialogContent>

      {(onConfirm || onCancel || cancelText) && (
        <StyledDialogActions>
          <LoadingButton
            onClick={handleCancel}
            loading={cancelLoading}
            disabled={confirmLoading}
            variant="outlined"
            color="inherit"
            {...cancelButtonProps}
          >
            {cancelText}
          </LoadingButton>
          {onConfirm && (
            <LoadingButton
              onClick={onConfirm}
              loading={confirmLoading}
              disabled={cancelLoading}
              variant="contained"
              color="primary"
              {...confirmButtonProps}
            >
              {confirmText}
            </LoadingButton>
          )}
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};

export default Modal;