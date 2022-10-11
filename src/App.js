import { Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import Resource from './Resource';
import { useDispatch } from 'react-redux';
import { useUser } from './api/useAuth';
import PrivateRoute from './utils/PrivateRoute';
import { setUser } from './store/features/authSlice';
import Loader from './projectComponents/Loader';

import useLocalStorage from 'use-local-storage';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage(
    'chatly-theme',
    defaultDark ? 'dark' : 'light'
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = (data) => {
    dispatch(setUser(data));

    navigate('/');
  };

  const { isLoading } = useUser(onSuccess);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div data-theme={theme}>
      <Routes>
        <Route
          path={Resource.Routes.HOME}
          element={
            <PrivateRoute>
              <HomePage setTheme={setTheme} />
            </PrivateRoute>
          }
        />

        <Route path={Resource.Routes.AUTH} element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
