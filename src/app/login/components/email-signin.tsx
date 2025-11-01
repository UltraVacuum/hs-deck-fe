import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { Button } from "@/components/ui/button"

export default function EmailSignIn() {
    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/");
    };

    const signUp = async (formData: FormData) => {
        "use server";

        const origin = headers().get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/login?message=Check email to continue sign in process");
    };

    return (
        <form action={signIn}>
            <div className="mb-4">
                <p className="text-zinc-500 text-left text-xs mb-2">
                    Email
                </p>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border 
                    block w-full"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
            </div>
            <div className="mb-4">
                <p className="text-zinc-500 text-left text-xs mb-2">
                    Password
                </p>
                <input
                    className="rounded-md px-4 py-2 block w-full
                    bg-inherit border"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
            </div>
            <Button
                type="submit"
                variant="outline"
                className="w-full hover:bg-sky-400 rounded-md
                px-4 py-4 text-foreground mb-4">
                Sign In
            </Button>
            {/* todo:fix error */}
            <Button
                variant="outline"
                formAction={signUp}
                className="w-full  hover:bg-sky-400
                rounded-md px-4 py-4 text-foreground"
            >
                Sign Up
            </Button>
        </form>
    )
}
