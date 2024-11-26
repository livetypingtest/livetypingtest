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
export const notificationToast = ({ message, body, url, icon, timer }) => {
  // Construct the `html` content dynamically
  const htmlContent = `
    <p>${body ? body : ''}</p>
    ${url ? `<a href="${url}" target="_blank" style="color: #007BFF;">${url}</a>` : ''}
  `;

  toastMixin.fire({
    icon: icon || 'success', // Default to success if no icon is provided
    title: message || 'Notification', // Default title
    html: htmlContent, // Set the dynamically generated HTML content
    timer: timer || 3000, // Default to 3 seconds if no timer is provided
  });
};
