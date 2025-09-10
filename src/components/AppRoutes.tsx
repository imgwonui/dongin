import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './layout/Layout';
import { HomePage } from '../pages/home/HomePage';
import { NoticesPage } from '../pages/NoticesPage';
import { QnAPage } from '../pages/QnAPage';
import { LearningDataPage } from '../pages/student/LearningDataPage';
import { VideoLearningPage } from '../pages/student/VideoLearningPage';
import { PaymentPage } from '../pages/student/PaymentPage';
import { ClinicPage } from '../pages/student/ClinicPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <HomePage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/qna" element={<QnAPage />} />
        <Route path="/learning-data" element={<LearningDataPage />} />
        <Route path="/videos" element={<VideoLearningPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/clinic" element={<ClinicPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
};