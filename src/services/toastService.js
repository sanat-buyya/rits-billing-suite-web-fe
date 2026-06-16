import { toast } from "react-toastify";

const AppToast = {
  showSuccess: (message, position = "top-right") =>
    toast.success(message, { position }),

  showError: (message, position = "top-right") =>
    toast.error(message, { position }),

  showInfo: (message, position = "top-right") =>
    toast.info(message, { position }),
};

export default AppToast;
