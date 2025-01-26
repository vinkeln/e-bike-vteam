import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    const login = (token) => setAuth(token);
    const logout = () => setAuth(null);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthContext.propTypes = {
    children: PropTypes.node.isRequired
  };
export { AuthContext, AuthProvider };
