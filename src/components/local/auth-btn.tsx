import Link from "next/link";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from './avatar'

export default async function AuthButton() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    // // console.log(user)

    const signOut = async () => {
        "use server";
        const supabase = createClient();
        await supabase.auth.signOut();
        return redirect("/");
    };

    return user ? (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserAvatar user={{
                        avatarUrl: user.user_metadata.avatar_url,
                        userName: user.user_metadata.full_name
                    }} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/user/profile">个人资料</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <form action={signOut}>
                            <button className="rounded-md 
                    no-underline bg-btn-background 
                    hover:bg-btn-background-hover">
                                登出
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ) : (
        <Link
            href="/login"
            className="flex rounded-md 
                no-underline bg-btn-background 
                hover:bg-btn-background-hover"
        >
            登录
        </Link>
    );
}
