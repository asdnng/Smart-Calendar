import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import api from '../axiosSetup.js';
import Loading from './loading.js';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [googleAccount, setGoogleAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkUserExist = async (email) => {
    try {
      const res = await api.post("/user/exist", email);
      console.log("check: ", res);
      return res;
    } catch (err) {
      console.error("Failed to check user: ", err);
    }
  };

  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/user');
      console.log("response: ", res.data);
      setUserEmail(res.data.email || "");
      setUserPassword(res.data.password || "");
    } catch (err) {
      console.error("Failed to load user info: ", err);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = async (updatedInfo) => {
    try {
      setIsLoading(true);
      const res = await api.put('/user', updatedInfo);
      setUserEmail(updatedInfo.email);
      setUserPassword(updatedInfo.password);
    } catch (err) {
      console.error("Update user failed: ", err);
      alert("Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    try {
      setIsLoading(true);
      await api.delete("/user", userEmail);
      setUserEmail("");
      setUserPassword("");
      setGoogleAccount("");
    } catch (err) {
      console.error("Delete user failed: ", err);
      alert("Failed to delete user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userEmail,
        userPassword,
        googleAccount,
        updateUser,
        deleteUser,
        checkUserExist
      }}
    >
      {isLoading && <Loading />}
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);