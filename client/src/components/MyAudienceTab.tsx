import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types/types";
import baseURL from "../config/baseUrl";

const MyAudienceTab: React.FC = () => {
  const [potentialClients, setPotentialClients] = useState<User[]>();

  useEffect(() => {
    const fetchPotentialClients = async () => {
      const response = await axios.get<User[]>(`${baseURL}/users`);
      setPotentialClients(response.data);
    };
    fetchPotentialClients();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-200">
      Audience insights coming soon.
    </div>
  );
};

export default MyAudienceTab;
