import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppProvider';
import { ChatProvider } from './contexts/ChatContext';
import AppEnrutador from './router/AppEnrutador'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ChatProvider>
          <AppEnrutador />
        </ChatProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)