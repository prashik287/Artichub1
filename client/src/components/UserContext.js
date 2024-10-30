import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userdata, setUserdata] = useState(null);

    return (
        <UserContext.Provider value={{ userdata, setUserdata }}>
        {children}
        </UserContext.Provider>
    );
};

const useUser = () => {
    return useContext(UserContext);
};

export { UserProvider, useUser };
