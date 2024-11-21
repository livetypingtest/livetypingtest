// DynamicAlert.js
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DynamicAlert = ({ type, title, message, trigger, navigateTo, confirmBtn, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (trigger) {
      Swal.fire({
        title: title || 'Alert',
        html: `
          <div>${message || ''}</div>
          ${navigateTo ? `
            <button id="navigate-btn" class="swal2-styled swal2-custom-btn">
              Login
            </button>
          ` : ''}
        `,
        icon: type || 'info',
        showConfirmButton: confirmBtn,
        confirmButtonText: 'OK', // Set the text for the confirm button
        didOpen: () => {
          // Attach event listener for the navigate button
          const navigateBtn = document.getElementById('navigate-btn');
          if (navigateBtn) {
            navigateBtn.addEventListener('click', () => {
              Swal.close(); // Close the alert
              if (navigateTo) {
                navigate(navigateTo); // Programmatic navigation
              }
            });
          }
        },
        // Handle the confirm button click
        preConfirm: () => {
          if (onClose) onClose(); // Call the onClose function if provided
        },
      });
    }
  }, [trigger, type, title, message, navigate, navigateTo, onClose]);

  return null; // Hidden component, no UI is rendered
};

export default DynamicAlert;
