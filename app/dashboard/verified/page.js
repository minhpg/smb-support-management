import getUserProfile from "@/supabase/getUserProfile";
import { Button, Flex, Text, Title } from "@tremor/react";
import Link from "next/link";

const DashboardAwaitVerificationPage = async () => {
  const { user } = await getUserProfile();
  if (user.verified) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-center">
            <div>
              <Title>Your account has been approved</Title>
              <Link href="/dashboard/requests">
                <Button variant="light">
                  <Flex>
                    Visit dashboard{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Flex>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center">
          <div>
            <Title>{"Waiting for administrator's verificaton"}</Title>
            <Text>
              Please wait while your account is being verified by system
              administrator
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAwaitVerificationPage;
