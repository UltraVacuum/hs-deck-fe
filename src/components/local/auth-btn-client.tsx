'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from './avatar'

export default function AuthButtonClient() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // 检查用户登录状态
        const checkUser = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData.user);
                }
            } catch (error) {
                console.error('Error checking user:', error);
            }
        };

        checkUser();
    }, []);

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return user ? (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserAvatar user={{
                        avatarUrl: user.user_metadata?.avatar_url,
                        userName: user.user_metadata?.full_name || user.email
                    }} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="/user/profile">个人资料</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <button className="rounded-md
                            no-underline bg-btn-background
                            hover:bg-btn-background-hover">
                            登出
                        </button>
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