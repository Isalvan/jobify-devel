import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './contexts/AppProvider';
import AppEnrutador from './router/AppEnrutador'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <AppEnrutador />
    </AppProvider>
  </StrictMode>,
)