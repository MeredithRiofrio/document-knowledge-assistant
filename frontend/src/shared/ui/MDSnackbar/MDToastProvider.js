// shared/ui/MDSnackbar/MDToastProvider.jsx

import { useEffect, useState } from "react";
import MDSnackbar from "./index";
import mdToast from "./mdToast";

let idCounter = 0;

function MDToastProvider() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    mdToast.register((toastData) => {
      idCounter++;
      setToast({ ...toastData, id: idCounter });
    });
  }, []);

  const handleClose = () => setToast(null);

  if (!toast) return null;

  return (
    <MDSnackbar
      key={toast.id}
      color={toast.type}
      icon={toast.icon}
      title={toast.title}
      dateTime={new Date().toLocaleTimeString()}
      content={toast.message}
      close={handleClose}
      open={true}
    />
  );
}

export default MDToastProvider;
