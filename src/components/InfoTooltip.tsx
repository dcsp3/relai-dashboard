// components/InfoTooltip.tsx
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export const InfoTooltip = ({ text }: { text: string }) => {
    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                </TooltipTrigger>

                <TooltipContent
                    side="right"
                    className="max-w-xs p-3 text-xs leading-relaxed"
                >
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
