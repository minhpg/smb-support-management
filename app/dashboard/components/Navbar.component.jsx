"use client";

import { Button, Flex } from "@tremor/react";

import Link from "next/link";

import Logo from "./Logo.component";
import NavbarDialog from "./NavbarDialog.component";
import { useSupabaseContext } from "../contexts/SupabaseClient.context";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user } = useSupabaseContext();
  const [navbarItems, setNavbarItems] = useState([]);

  useEffect(() => {

    console.log(user)
    
    if (!user) {
      return;
    }

    if (user.role && user.verified) {
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
            title: "Dashboard",
            path: "/dashboard",
          },
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

  return (
    <>
      <Flex className="my-6" justifyContent="between" alignItems="center">
        <Flex justifyContent="start">
          <div className="hidden lg:block w-full text-xl">
            <Logo />
          </div>
          <div className="lg:hidden w-full text-xl">
            <Logo />
          </div>
          {navbarItems.length > 0 && (
            <>
              <Flex className="space-x-8 hidden xl:flex" justifyContent="end">
                {navbarItems.map((item) => (
                  <Link href={item.path} key={item.path}>
                    <Button color="slate" variant="light" className={`h-full`}>
                      {item.title}
                    </Button>
                  </Link>
                ))}
                <Link href="/dashboard/account">
                  <Button variant="light" className="h-full">
                    {/* {user.first_name && user.last_name ? (
                      <>
                        {user.first_name} {user.last_name}
                      </>
                    ) : (
                      "Your account"
                    )} */}
                    Account
                  </Button>
                </Link>
                <Link href="/auth/signout">
                  <Button color="red" variant="light" className="h-full">
                    Logout
                  </Button>
                </Link>
              </Flex>
              <NavbarDialog navbarItems={navbarItems} user={user} />
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Navbar;
