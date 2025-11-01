'use client';
import { ClipCopy } from '@/components/local/clip-copy';

import "./color-card.css";

// todo: formate
const hsvFormat = (color: any) => {

}

export default function ColorCard({ color }: { color: any }) {
    return (
        <div
            className="
                w-full h-24 
                px-4 py-2
                border border-dotted 
                card-item
            "
            style={{
                background: `${color.hex}`
            }}
        >
            <ClipCopy text={color.hex}>
                {color.hex}
                {color.alpha}
            </ClipCopy>
        </div>
    )
};
