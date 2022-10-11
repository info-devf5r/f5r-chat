import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useUser } from '../api/useAuth';
import Loader from '../projectComponents/Loader';

function PrivateRoute({ children }) {
  const auth = useSelector((state) => state.auth.isAuthenticated);
  // const { isLoading, isSuccess } = useUser();
  // if (isLoading) return <Loader />;
  return auth ? children : <Navigate to='/auth' />;
}

export default PrivateRoute;
