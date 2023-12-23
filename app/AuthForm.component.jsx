"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Logo from "./dashboard/Logo.component";

const AuthForm = () => {
  const supabase = createClientComponentClient();

  return (
    <div className="flex flex-col h-screen justify-center w-screen">
      <div className="flex justify-center w-full">
        <div>
          <Logo />
          <Auth
            supabaseClient={supabase}
            view="magic_link"
            appearance={{ theme: ThemeSupa }}
            theme="light"
            showLinks={false}
            providers={[]}
            redirectTo="http://localhost:3000/auth/callback"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
