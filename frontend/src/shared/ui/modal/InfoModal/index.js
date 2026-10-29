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

function InfoModal({
  open,
  title,
  content,
  onClose,
  isLoading = false,
  error = null,
  maxWidth = "lg",
}) {
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
      <MDBox p={2}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent sx={{ maxHeight: "400px", overflowY: "auto" }}>
          <StatusContent isLoading={isLoading} error={error}>
            <MDTypography variant="body2" whiteSpace="pre-line">
              {content}
            </MDTypography>
          </StatusContent>
        </DialogContent>
        <DialogActions>
          <MDButton variant="gradient" color="info" onClick={onClose} disabled={isLoading}>
            Cerrar
          </MDButton>
        </DialogActions>
      </MDBox>
    </Dialog>
  );
}

InfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  content: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  maxWidth: PropTypes.string,
};

export default InfoModal;
