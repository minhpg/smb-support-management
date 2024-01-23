"use client";

import { Dialog } from "@headlessui/react";
import { Button, Card, Flex } from "@tremor/react";
import Link from "next/link";
import { useState } from "react";

import Logo from "./Logo.component";

const NavbarDialog = ({ navbarItems, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Flex alignItems="center" className="relative lg:hidden space-x-4">
        <Flex justifyContent="end" className="space-x-3.5">
          <Button onClick={() => setIsOpen(true)} color="slate" variant="light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </Button>
        </Flex>
      </Flex>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/30 z-40" aria-hidden="true" />
        <div className="fixed inset-x-0 top-0 z-50 opacity-100 scale-100">
          <Dialog.Panel>
            <Card className="p-0 max-w-7xl mx-auto px-6 sm:px-8 rounded-none shadow-none bg-white">
              <Flex className="py-6" justifyContent="between">
                <div className="text-xl">
                  <Logo />
                </div>
                <Button
                  color="slate"
                  variant="light"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </Flex>
              <div className="py-3 px-5 text-lg flex flex-col">
                {navbarItems.map((item) => (
                  <Link
                    href={item.path}
                    key={item.path}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      size="xl"
                      color="slate"
                      variant="light"
                      className="py-4"
                    >
                      {item.title}
                    </Button>
                  </Link>
                ))}
                <Link href="/dashboard/account">
                  <Button variant="light" size="xl" className="py-4">
                    {user.first_name && user.last_name ? (
                      <>
                        {user.first_name} {user.last_name}
                      </>
                    ) : (
                      "Your account"
                    )}
                  </Button>
                </Link>
                <Link href="/auth/signout">
                  <Button
                    color="red"
                    variant="light"
                    size="xl"
                    className="font-medium py-4"
                  >
                    Logout
                  </Button>
                </Link>
              </div>
            </Card>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default NavbarDialog;
