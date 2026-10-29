import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import MDTypography from "shared/ui/MDTypography";
import MDButton from "shared/ui/MDButton";
import MDBox from "shared/ui/MDBox";
import StatusContent from "shared/ui/StatusContent";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmModal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  isLoading = false,
  maxWidth = "sm",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) {
  // ⬇️ guarda quién tenía foco al abrir
  const openerRef = useRef(null);
  useEffect(() => {
    if (open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
  }, [open]);

  const handleClose = (event, reason) => {
    const tryingToCloseByBackdrop = reason === "backdropClick";
    const tryingToCloseByEscape = reason === "escapeKeyDown";
    if (isLoading && (tryingToCloseByBackdrop || tryingToCloseByEscape)) return;
    onClose?.(event, reason);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth={maxWidth}
      disableRestoreFocus // ⬇️ desactiva restauración automática de MUI
      TransitionProps={{
        onExited: () => {
          openerRef.current?.focus?.(); // ⬇️ restaura foco MANUALMENTE
        },
      }}
    >
      <MDBox p={1}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          <StatusContent isLoading={isLoading}>
            <MDTypography color="text" variant="body2">
              {message}
            </MDTypography>
          </StatusContent>
        </DialogContent>

        <DialogActions>
          <MDButton variant="outlined" color="info" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </MDButton>
          <MDButton variant="gradient" color="info" onClick={onConfirm} disabled={isLoading}>
            {confirmText}
          </MDButton>
        </DialogActions>
      </MDBox>
    </Dialog>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  maxWidth: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default ConfirmModal;
