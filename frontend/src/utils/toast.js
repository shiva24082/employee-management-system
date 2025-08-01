import { toast } from 'react-toastify';

export const showToast = (message, type = 'success') => {
  const options = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    default:
      toast(message, options);
  }
};