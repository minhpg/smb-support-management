import { useEffect, useState } from "react";

const useGroups = (supabase) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("groups")
      .select("*, campus (id, name)")
      .then(({ data }) => {
        if (data) setGroups(data);
        setLoading(false);
      });
  }, []);

  return { groups, loading };
};

export default useGroups;
