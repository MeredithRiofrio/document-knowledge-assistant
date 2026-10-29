// src/shared/ui/modal/FormModal/index.js
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import MDButton from "shared/ui/MDButton";
import MDBox from "shared/ui/MDBox";
import StatusContent from "shared/ui/StatusContent";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FormModal({
  open,
  title,
  children,
  onClose,
  isLoading = false,
  error,
  maxWidth = "sm",
  formId,
  submitLabel = "Guardar",
}) {
  // Guardamos el elemento que tenía foco al abrir
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
      disableRestoreFocus
      TransitionProps={{
        onExited: () => {
          openerRef.current?.focus?.();
        },
      }}
    >
      <MDBox p={1}>
        {title && <DialogTitle>{title}</DialogTitle>}

        <DialogContent>
          <StatusContent isLoading={isLoading} error={error}>
            {children}
          </StatusContent>
        </DialogContent>

        <DialogActions>
          <MDButton variant="outlined" color="info" onClick={onClose} disabled={isLoading}>
            Cancelar
          </MDButton>

          <MDButton
            type="submit"
            form={formId}
            variant="gradient"
            color="info"
            disabled={isLoading}
            autoFocus
          >
            {submitLabel}
          </MDButton>
        </DialogActions>
      </MDBox>
    </Dialog>
  );
}

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  maxWidth: PropTypes.string,
  formId: PropTypes.string.isRequired,
  submitLabel: PropTypes.string,
};

export default FormModal;
