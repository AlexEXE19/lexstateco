import { useEffect, useState } from "react";
import { User } from "../types/types";
import baseURL from "../config/baseUrl";
import axios from "axios";

const MyAudienceTab: React.FC = () => {
  const [potentialClients, setPotentialClients] = useState<User[]>();

  useEffect(() => {
    const fetchPotentialClients = async () => {
      const response = await axios.get<User[]>(`${baseURL}/users`);
      setPotentialClients(response.data);
    };
    fetchPotentialClients();
  }, []);

  return <div></div>;
};

export default MyAudienceTab;
