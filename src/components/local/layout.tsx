import { ServerCrash } from "lucide-react"

export const BasicLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}

export const ContentLayout = ({ children }: {
    children: React.ReactNode
}) => {
    'use client';
    return (
        <div className="container min-h-80 py-8">
            {children}
        </div>
    )
}

export const ErrorView = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className="container py-20 h-full">
            {children}
            <div className="flex items-center justify-center">
                <ServerCrash className="text-red-500" size={48} />
                <span className="text-red-500 text-center text-4xl ml-4">
                    Ops... Something is wrong...
                </span>
            </div>
        </div>
    )
}
