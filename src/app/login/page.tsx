import Link from "next/link";
import { ChevronLeft } from 'lucide-react';
import { ContentLayout } from "@/components/local/layout";
import GoogleSignIn from "./components/google-signin";
import EmailSignIn from "./components/email-signin";

export default function Page({
    searchParams,
}: {
    searchParams: {
        message?: string,
        code?: string
    };
}) {

    return (
        <ContentLayout>
            <Link
                href="/"
                className="py-2 rounded-md no-underline text-foreground 
                            bg-btn-background hover:bg-btn-background-hover 
                            flex items-center group text-sm"
            >
                <ChevronLeft />
                Back
            </Link>
            <div className="mt-8">
                <div className="flex flex-col w-full mx-auto
                    px-8 sm:max-w-md justify-center gap-2">
                    <div className="animate-in text-center 
                        flex-1 flex flex-col w-full justify-center
                        gap-2 text-foreground space-y-4">
                        <GoogleSignIn />
                        <hr />
                        <EmailSignIn />
                    </div>
                    {searchParams?.message && (
                        <p className="mt-4 px-4 py-2 bg-foreground/10 
                            text-foreground text-center">
                            {searchParams.message}
                        </p>
                    )}
                </div>
            </div>
        </ContentLayout>
    );
}
