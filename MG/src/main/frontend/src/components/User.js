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
      const res = await api.post("/user/exist", { email }); // JSON body!!!
      return res.data === true;
    } catch (err) {
      console.error("Failed to check user: ", err);
      return false;
    }
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, skipping user load.");
      return; 
    }

    setIsLoading(true);

    try {
      const res = await api.get('/user');
      setUserEmail(res.data.email || "");
      setUserPassword(""); // do not keep password in frontend
    } catch (err) {
      console.error("Failed to load user info: ", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = async (updatedInfo) => {
    try {
      setIsLoading(true);
      const res = await api.put('/user', updatedInfo);
      // store newly issued tokens
      if (res.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }
      if (res.data?.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
      setUserEmail(updatedInfo.email ?? userEmail);
      setUserPassword("");
    } catch (err) {
      console.error("Update user failed: ", err);
      alert("Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (password) => {
    try {
      setIsLoading(true);
      await api.delete("/user", { data: { email: userEmail, password } });
      setUserEmail("");
      setUserPassword("");
      setGoogleAccount("");
      return { ok: true };
    } catch (err) {
      console.error("Delete user failed: ", err);
      const message = err.response?.data?.message || "Failed to delete user.";
      return { ok: false, message };
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