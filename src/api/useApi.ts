import axios from "axios";
import { useEffect, useState } from "react";

const useApi = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("api");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(token);
  }, []);

  if (token) {
    return axios.create({
      baseURL: "http://localhost:3000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    return axios.create({
      baseURL: "http://localhost:3000",
    });
  }
};

export default useApi;
