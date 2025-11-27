import {
    SiOpenai,
    SiAnthropic,
    SiDiscord,
    SiGithub,
    SiGoogle,
    SiPerplexity,
    SiGooglegemini,
} from "react-icons/si";


import { Bot } from "lucide-react";

interface ToolIconProps {
    slug: string; // now we use a slug instead of name
    size?: number;
    className?: string;
}

export const ToolIcon = ({
    slug,
    size = 20,
    className = "",
}: ToolIconProps) => {
    const iconMap: Record<string, JSX.Element> = {
        openai: <SiOpenai size={size} />,
        gemini: <SiGooglegemini size={size} />,
        anthropic: <SiAnthropic size={size} />,
        perplexity: <SiPerplexity size={size} />,
        github: <SiGithub size={size} />,
        discord: <SiDiscord size={size} />,
        google: <SiGoogle size={size} />,
    };

    const Icon = iconMap[slug.toLowerCase()];

    return (
        <div className={`text-foreground/90 dark:text-foreground ${className}`}>
            {Icon ?? <Bot size={size} className="opacity-60" />}
        </div>
    );
};
