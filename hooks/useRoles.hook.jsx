import { useEffect, useState } from "react";

const useRoles = (supabase) => {
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    supabase
      .from("roles")
      .select("*")
      .then(({ data }) => {
        console.log(data);
        setCampuses(data);
      });
  }, []);

  return campuses;
};

export default useRoles;
