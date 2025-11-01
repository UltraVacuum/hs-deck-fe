import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils"
import { upperCase } from "lodash";

const uName = (str: string) => upperCase(str[0])

export default function UserAvatar({
    className,
    user: {
        avatarUrl,
        userName
    }
}: {
    className?: string,
    user: {
        avatarUrl: string,
        userName: string
    }
}) {
    return (
        <Avatar
            className={cn(
                "w-8 h-8",
                className
            )}
        >
            <AvatarImage
                src={avatarUrl} />
            <AvatarFallback>
                {uName(userName)}
            </AvatarFallback>
        </Avatar>
    )
}
