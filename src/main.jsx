import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { installGlobalErrorTrap } from './errorTrap.js';
import './styles/global.css';

installGlobalErrorTrap();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('No se encontró el elemento #root.');
createRoot(rootElement).render(<App />);
