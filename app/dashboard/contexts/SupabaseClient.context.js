import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext } from "react";

const SupabaseContext = createContext({});


const SupabaseContextProvider = ({ children }) => {

    const supabase = createClientComponentClient();

    const data = {
        supabase
    }
    return <SupabaseContext.Provider value={data}>{children}</SupabaseContext.Provider>
}

export default SupabaseContextProvider

export const useSupabaseContext = () => {
    return useContext(SupabaseContext)
}