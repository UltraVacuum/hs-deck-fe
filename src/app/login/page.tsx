import Link from "next/link";
import { ChevronLeft } from 'lucide-react';
import { ContentLayout } from "@/components/local/layout";
import EmailSignIn from "./components/email-signin";
import GoogleSignIn from "./components/google-signin";
import Navigation from '@/components/local/navigation';

export default function Page({
    searchParams,
}: {
    searchParams: {
        message?: string,
        code?: string
    };
}) {

    return (
        <>
            <Navigation />
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
                        <h2 className="text-2xl font-bold text-foreground mb-6">
                            登录账号 | Sign In
                        </h2>
                        <EmailSignIn />
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    或继续使用
                                </span>
                            </div>
                        </div>
                        <GoogleSignIn />
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
        </>
    );
}
