import Root from '@/routes/root';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import ErrorPage from '@/error-page';
import ProblemsRoute from '@/routes/problems';
import QuestionRoute from '@/routes/question';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'problems',
        element: <ProblemsRoute />,
      },
      {
        path: 'problems/:questionId',
        element: <QuestionRoute />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
