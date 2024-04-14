import React from 'react';
import { createRoot } from 'react-dom/client'
import CanvasComponent from './canvas'
import App from './App';


const menubarElement = document.getElementById('react-menu-bar');
const canvasElement = document.getElementById('react-canvas');

if (menubarElement) {
  createRoot(menubarElement).render(

      <App />

  );
} else {
  console.error('Menubar element not found');
}
// if (canvasElement) {
//   createRoot(canvasElement).render(
//     <React.StrictMode>
//       <CanvasComponent />
//     </React.StrictMode>
//   );
// } else {
//   console.error('Canvas element not found');
// }