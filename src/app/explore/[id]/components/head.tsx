import {
    AppWindow,
    Palette,
    CalendarCheck,
    CalendarClock
} from 'lucide-react';
import Link from 'next/link';
import dayjs from "@/lib/time";
import UserAvatar from '@/components/local/avatar'

export default function PageHead({ item }: { item: any }) {
    return (
        <div className="head">
            <div className="flex items-center flex-wrap text-zinc-700 text-xl">
                <AppWindow className="w-6 h-6 mr-2 text-sky-500" />
                <Link
                    href={item.page_url}
                    target="_blank"
                    className=""
                >
                    {item.page_title}
                </Link>
            </div>
            <div className="flex items-center text-sm text-zinc-500 my-2 space-x-4">
                <p className="flex items-center">
                    <CalendarCheck className="w-4 h-4 mr-1 text-sky-500" />
                    <span className="">
                        {dayjs(item.created_at).fromNow()}
                    </span>
                </p>
                <p className="flex items-center">
                    <CalendarClock className="w-4 h-4 mr-1 text-sky-500" />
                    <span className="">
                        {dayjs(item.updated_at).fromNow()}
                    </span>
                </p>
                <p className="flex items-center">
                    <Palette className="w-4 h-4 mr-1 text-sky-500" />
                    <span className="">
                        {item.page_colors.length}
                    </span>
                </p>
                <div className="flex items-center">
                    <UserAvatar
                        className="w-5 h-5"
                        user={{
                            avatarUrl: item.user.avatar,
                            userName: item.user.name
                        }}
                    />
                    <p className="ml-2 text-sky-500">
                        {item.user.name}
                    </p>
                </div>
            </div>
        </div>
    )
}
