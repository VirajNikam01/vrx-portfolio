import { cn } from "@/lib/utils";

type InitialAvatarProps = {
    title: string;
    className?: string;
};

const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-rose-500 to-red-600",
];

export function InitialAvatar({ title, className }: InitialAvatarProps) {
    const initial = title.trim()[0]?.toUpperCase() ?? "?";
    const gradient = gradients[title.charCodeAt(0) % gradients.length];

    return (
        <div className={cn("flex items-center justify-center bg-gradient-to-br font-bold text-white", gradient, className)}>
            {initial}
        </div>
    );
}
