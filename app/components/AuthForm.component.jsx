"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Logo from "../dashboard/components/Logo.component";

const AuthForm = () => {
  const supabase = createClientComponentClient();

  return (
    <div className="flex flex-col h-screen justify-center w-screen">
      <div className="flex justify-center w-full">
        <div>
          <div className="flex w-full justify-center">
            <Logo />
          </div>
          <Auth
            supabaseClient={supabase}
            view="magic_link"
            appearance={{ theme: ThemeSupa }}
            theme="light"
            showLinks={false}
            providers={["azure"]}
            redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
