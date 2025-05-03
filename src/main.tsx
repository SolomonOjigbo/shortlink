import App from './App.tsx';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';


const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}