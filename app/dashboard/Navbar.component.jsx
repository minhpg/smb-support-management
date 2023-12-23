import { Button, Flex } from "@tremor/react";
import Link from "next/link";
import Logo from "./Logo.component";
import NavbarDialog from "./NavbarDialog.component";

export const navbarItems = [
  {
    title: "Groups",
    path: "/dashboard/groups",
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
    path: '/dashboard/update-types'
  },
  {
    title: "Users",
    path: "/dashboard/users",
  },
  {
    title: "Monitor",
    path: "/dashboard/monitor",
  },
];


const Navbar = async () => {
  // const { user, supabase} = await getUserProfile();
  // console.log(user)

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
          <Flex className="space-x-8 hidden lg:flex" justifyContent="end">
            {navbarItems.map((item) => (
              <Link href={item.path} key={item.path}>
                <Button color="slate" variant="light" className={`h-full`}>
                  {item.title}
                </Button>
              </Link>
            ))}
            <Link href="/auth/signout">
              <Button color="red" variant="light" className="h-full">
                Logout
              </Button>
            </Link>
          </Flex>
		  <NavbarDialog navbarItems={navbarItems}/>
        </Flex>
      </Flex>
    </>
  );
};

export default Navbar;
