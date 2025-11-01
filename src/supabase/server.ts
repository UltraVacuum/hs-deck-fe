import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type SupabaseClientContext = 'public' | 'auth' | 'admin';

// 检查是否在构建时
function isBuildTime(): boolean {
    return process.env.NODE_ENV === 'production' &&
           process.env.NEXT_PHASE === 'phase-production-build' ||
           process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production' && !process.env.VERCEL_URL;
}

// 环境变量验证（延迟到实际使用时）
function validateEnvironment() {
    const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

// 需要用户认证的客户端（保留cookie支持）
export const createClient = () => {
    validateEnvironment(); // 在实际使用时验证环境变量

    // 在构建时避免访问 cookies
    if (isBuildTime()) {
        throw new Error('Cannot use authenticated client during build time. Use createPublicClient instead.');
    }

    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: "", ...options });
                    } catch {
                        // The `delete` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        },
    );
};

// 公共数据访问客户端（无cookie，更高效）
export const createPublicClient = () => {
    validateEnvironment(); // 在实际使用时验证环境变量
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

// 服务角色客户端（管理员操作）
export const createServiceRoleClient = () => {
    validateEnvironment(); // 在实际使用时验证环境变量
    if (!process.env.SUPABASE_SERVICE_KEY) {
        throw new Error('SUPABASE_SERVICE_KEY environment variable is required for service role operations');
    }

    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};

// 上下文感知的客户端选择器
export const getSupabaseClient = (context: SupabaseClientContext = 'public') => {
    switch (context) {
        case 'auth':
            return createClient();
        case 'admin':
            return createServiceRoleClient();
        case 'public':
        default:
            return createPublicClient();
    }
};
