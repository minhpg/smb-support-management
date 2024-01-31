import { useEffect, useState } from "react";

const useGroupUsers = (supabase, groupId) => {
  const [users, setUsers] = useState(null);
  const [groupUsers, setGroupUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("users")
      .select("*, campus (name), role (name)")
      .then(({ data }) => {
        if (data) setUsers(data);
      });
  }, []);

  useEffect(() => {
    supabase
      .from("group_members")
      .select("user(*)")
      .eq("group", groupId)
      .then(({ data }) => {
        if (data) setGroupUsers(data.map(({ user }) => user.id));
      });
  }, []);

  useEffect(() => {
    if (users && groupUsers) {
      setLoading(false);
    }
  }, [users, groupUsers]);

  return { users, groupUsers, loading };
};

export default useGroupUsers;
