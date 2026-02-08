import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import DocumentCenter from './pages/DocumentCenter'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          <Route path="/" element={<DocumentCenter />} />
          <Route path="/documents" element={<DocumentCenter />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </StrictMode>
)