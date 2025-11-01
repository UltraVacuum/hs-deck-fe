import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import GoogleIcon from './google-icon';
import { Button } from "@/components/ui/button"

export default function GoogleSignIn() {

    const signInWithGoogle = async (formData: FormData) => {
        "use server";
        const supabase = createClient();
        const redirectUrl = process.env.NEXT_AUTH_REDIRECT_URL
        const { data, error }: any = await supabase.
            auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                },
            })
        if (data) {
            // console.log(data.url)
            return redirect(data.url)
        }
    }

    return (
        <form action={signInWithGoogle}>
            <Button type="submit"
                className="btn-md grow w-full flex 
                    items-center justify-center 
                    border border-foreground/20 
                    rounded-md px-4 py-5 text-foreground"
                variant="outline"
            >
                <div className="w-4 h-4 mr-4">
                    <GoogleIcon />
                </div>
                Continue with Google
            </Button>
        </form>
    )
}
