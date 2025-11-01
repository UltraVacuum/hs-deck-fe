"use client";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import copy from 'clipboard-copy';
import { useToast } from "@/components/ui/use-toast";
import { Copy, CopyCheck } from 'lucide-react';

import './clip-copy.css';

export const ClipCopy = ({
    text,
    children
}: {
    text: string,
    children: React.ReactNode
}) => {

    const [copied, setCopy] = useState(false);
    const { toast } = useToast()

    const handleCopyClick = async () => {
        try {
            const textCopied = await copy(text);
            setCopy(true)
        } catch (err) {
            toast({
                title: "Copy Failed",
                description: "Failed to copy text to clipboard:" + err,
            })
        }
    };

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopy(false)
            }, 3000)
        }
    }, [copied])

    return (
        <div onClick={handleCopyClick}
            className={cn(
                "copy-item relative px-4 py-2 cursor-copy",
                copied && "text-green-500"
            )}
        >
            {children}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {
                    copied ?
                        <CopyCheck className="w-4 h-4 text-green-500" /> :
                        <Copy className="w-4 h-4" />
                }
            </div>
        </div>
    );
};
