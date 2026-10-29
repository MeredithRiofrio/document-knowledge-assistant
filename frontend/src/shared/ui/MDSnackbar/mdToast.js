// shared/ui/MDSnackbar/mdToast.js

let notify;

const mdToast = {
  register(fn) {
    notify = fn;
  },
  success(message) {
    notify?.({
      type: "success",
      title: "Éxito",
      message,
      icon: "check",
    });
  },
  error(message) {
    notify?.({
      type: "error",
      title: "Error",
      message,
      icon: "error",
    });
  },
  info(message) {
    notify?.({
      type: "info",
      title: "Notificación",
      message,
      icon: "notifications",
    });
  },
  warning(message) {
    notify?.({
      type: "warning",
      title: "Advertencia",
      message,
      icon: "info",
    });
  },
};

export default mdToast;
