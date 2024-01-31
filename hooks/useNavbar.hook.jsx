import { useEffect, useState } from "react";

const useNavbar = (supabase) => {
  const [navbarItems, setNavbarItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data } = await supabase
          .from("users")
          .select("*, campus (*), role (*)")
          .eq("id", session.user.id)
          .single();
        setUser(data);
      }

      if (!user) {
        return;
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role) {
      if (user.role.permission_level == "USER") {
        setNavbarItems([
          {
            title: "Requests",
            path: "/dashboard/requests",
          },
        ]);
      }

      if (user.role.permission_level == "MODERATOR") {
        setNavbarItems([
          {
            title: "Requests",
            path: "/dashboard/requests",
          },
          {
            title: "Approvals",
            path: "/dashboard/approvals",
          },
        ]);
      }

      if (user.role.permission_level == "ADMIN") {
        setNavbarItems([
          {
            title: "Groups",
            path: "/dashboard/groups",
          },
          {
            title: "Campuses",
            path: "/dashboard/campuses",
          },
          {
            title: "Requests",
            path: "/dashboard/requests",
          },
          {
            title: "Approvals",
            path: "/dashboard/approvals",
          },
          {
            title: "Update Types",
            path: "/dashboard/update-types",
          },
          {
            title: "Users",
            path: "/dashboard/users",
          },
        ]);
      }
    }
  }, [user]);

  return {
    navbarItems,
    user,
  };
};

export default useNavbar;
