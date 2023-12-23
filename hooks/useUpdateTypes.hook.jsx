import { useEffect, useState } from "react";

const useUpdateTypes = (supabase) => {
  const [types, setTypes] = useState([]);
  useEffect(() => {
    supabase
      .from("update_types")
      .select("*")
      .then(({ data }) => {
        console.log(data);
        if (data) setTypes(data);
      });
  }, []);

  return types;
};

export default useUpdateTypes;
