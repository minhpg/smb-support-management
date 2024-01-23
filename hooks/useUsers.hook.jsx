import { useEffect, useState } from "react";

const useUsers = (supabase) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("users")
      .select("*, campus (name), role (name)")
      .then(({ data }) => {
        if (data) setUsers(data);
        setLoading(false);
      });
  }, []);

  return { users, loading };
};

export default useUsers;
