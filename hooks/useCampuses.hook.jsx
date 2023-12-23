import { useEffect, useState } from "react";

const useCampuses = (supabase) => {
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    supabase
      .from("campuses")
      .select("*")
      .then(({ data }) => {
        console.log(data);
        if(data) setCampuses(data);
      });
  }, []);

  return campuses;
};

export default useCampuses;
