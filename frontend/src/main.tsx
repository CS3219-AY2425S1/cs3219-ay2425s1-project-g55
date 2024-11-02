import ErrorPage from '@/error-page';
import DiscussRoute from '@/routes/discuss';
import ProblemsRoute from '@/routes/problems';
import QuestionRoute from '@/routes/question';
import RoomRoute from '@/routes/room';
import Root from '@/routes/root';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

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
      {
        path: 'discuss',
        element: <DiscussRoute />,
      },
      {
        path: 'rooms/:roomId',
        element: <RoomRoute />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
