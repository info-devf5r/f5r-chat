import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

function RequireAuth(props) {
    let auth = useAuth();
    
    if (!auth.user) {
        return <Navigate to="/login" replace />
    }
    return props.children;
}

export default RequireAuth;