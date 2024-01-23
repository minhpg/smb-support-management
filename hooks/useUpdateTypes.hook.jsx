import { useEffect, useState } from "react";

const useUpdateTypes = (supabase, campusId) => {
  const [types, setTypes] = useState([]);
  useEffect(() => {
    supabase
      .from("update_types")
      .select("*")
      .or("campus.is.null" + (campusId ? ",campus.eq." + campusId : ""))
      .then(({ data }) => {
        if (data) setTypes(data);
      });
  }, []);

  return types;
};

export default useUpdateTypes;
