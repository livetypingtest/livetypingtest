// ToastComponent.js
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Toast = withReactContent(Swal);

const toastMixin = Swal.mixin({
  toast: true,
  icon: 'success',
  title: 'General Title',
  position: 'top-right',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  animation: true,
  // Adding bounce effect using SweetAlert2 built-in animations
  showClass: {
    popup: 'swal2-show swal2-bounce-in',
  },
  hideClass: {
    popup: 'swal2-hide swal2-bounce-out',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

// Dynamic toast function
export const dynamicToast = ({ message, icon, timer = 3000 }) => {
  toastMixin.fire({
    icon: icon,
    title: message,
    timer: timer,
  });
};
