import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import ReportMember from './pages/ReportMember';
import ReportChanagePackage from './pages/ReportChanagePackage';
import ReportSumSalePerDay from './pages/ReportSumSalePerDay';
import ReportSumSalePerMonth from './pages/ReportSumSalePerMonth';
import ReportSumSalePerYear from './pages/ReportSumSalePerYear';
import Admin from './pages/Admin';


const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/home', element: <Home /> },
  { path: '/report-member', element: <ReportMember /> },
  { path: '/report-chanage-package', element: <ReportChanagePackage /> },
  { path: '/report-sum-sale-per-day', element: <ReportSumSalePerDay /> },
  { path: '/report-sum-sale-per-month', element: <ReportSumSalePerMonth /> },
  { path: '/report-sum-sale-per-year', element: <ReportSumSalePerYear /> },
  { path: '/user-admin', element: <Admin /> }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);


reportWebVitals();
