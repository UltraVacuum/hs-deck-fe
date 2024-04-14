'use client';
import { useEffect, useState } from "react";
import { Loader, ServerCrash } from "lucide-react"
import { UserContext } from '@/context'
import { createClient } from "@/supabase/client";

export const ContentLayout = ({ children }: {
    children: React.ReactNode
}) => {
    const [user, setUser]: any = useState(null)
    const [fetchAuth, setFetchAuth] = useState(false)

    useEffect(() => {
        console.log('update effect', fetchAuth)
        const initUser = async () => {
            const supabase = createClient();
            const {
                data: { user: cu },
            } = await supabase.auth.getUser();
            if (cu) setUser(cu)
        }
        if (!fetchAuth) {
            initUser()
            setFetchAuth(true)
        }
    }, [fetchAuth])

    return (
        <UserContext.Provider value={{
            user,
            setUser
        }}>
            <div className="container min-h-80 py-8">
                <div className="container">

                    {children}
                </div>
            </div>
        </UserContext.Provider >
    )
}

export const ErrorView = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <ContentLayout>
            <div className="container py-20 h-full">
                <div className="flex items-center justify-center">
                    <ServerCrash className="text-red-500" size={48} />
                    <span className="text-red-500 text-center text-4xl ml-4">
                        Ops... Something is wrong...
                    </span>
                </div>
            </div>
        </ContentLayout>
    )
}
