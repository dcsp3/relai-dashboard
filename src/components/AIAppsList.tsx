import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Bot, Clock, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ToolIcon } from "./ToolIcon";

interface AIApp {
    name: string;
    url: string;
    timeUsed: string;
    blocked: boolean;
    category: string;
    limit: number; // daily limit in minutes
}

const initialApps = [
    {
        name: "ChatGPT",
        slug: "openai",
        url: "chat.openai.com",
        timeUsed: "45m",
        blocked: true,
        category: "Chat",
        limit: 60,
    },
    {
        name: "Gemini",
        slug: "gemini",
        url: "gemini.google.com",
        timeUsed: "48m",
        blocked: false,
        category: "Chat",
        limit: 60,
    },
    {
        name: "Claude",
        slug: "anthropic",
        url: "claude.ai",
        timeUsed: "32m",
        blocked: true,
        category: "Chat",
        limit: 60,
    },
    {
        name: "Perplexity",
        slug: "perplexity",
        url: "perplexity.ai",
        timeUsed: "22m",
        blocked: true,
        category: "Search",
        limit: 60,
    },
    {
        name: "Stable Diffusion",
        slug: "stabilityai",
        url: "stability.ai",
        timeUsed: "18m",
        blocked: false,
        category: "Image",
        limit: 60,
    },
    {
        name: "GitHub Copilot",
        slug: "github",
        url: "github.com/copilot",
        timeUsed: "1h 12m",
        blocked: true,
        category: "Code",
        limit: 60,
    },
];


interface AIAppsListProps {
    title?: string;
    description?: string;
    highlight?: string;
}

const AIAppsList = ({
}: AIAppsListProps) => {
    const [apps, setApps] = useState(initialApps);

    const toggleBlock = (index: number) => {
        setApps((prev) =>
            prev.map((app, i) =>
                i === index ? { ...app, blocked: !app.blocked } : app
            )
        );
    };

    const updateLimit = (index: number, newLimit: number) => {
        setApps((prev) =>
            prev.map((app, i) =>
                i === index ? { ...app, limit: newLimit } : app
            )
        );
    };

    return (
        <Card className="p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <CardHeader className="p-4 flex !flex-row !items-center !justify-between !space-y-0">
                {/* Left side: title + description stacked */}
                <div className="flex flex-col">
                    <CardTitle>Your Tools</CardTitle>
                    <CardDescription>
                        Enable/Disable access to AI tools.
                    </CardDescription>
                </div>

                {/* Right side: Add Tool button */}
                <Button className="gap-2 px-3 py-2" variant="secondary">
                    <Plus className="h-4 w-4" />
                    Add Tool
                </Button>
            </CardHeader>

            <div className="space-y-3">
                {apps.map((app, index) => (
                    <div
                        key={app.name}
                        className="flex flex-col gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50"
                    >
                        {/* MAIN ROW */}
                        <div className="flex items-center justify-between">
                            {/* Left Side */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className="p-2.5 rounded-lg bg-secondary/30">
                                    <ToolIcon slug={app.slug} size={20} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-foreground">
                                            {app.name}
                                        </h3>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {app.category}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {app.url}
                                    </p>
                                </div>
                            </div>
                            {/* Time used */}
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {app.timeUsed}
                                </span>
                            </div>
                            {/* Right-side controls */}
                            <div className="flex flex-col items-end justify-center gap-2 w-32">
                                {/* Block toggle */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {app.blocked ? "Blocked" : "Allowed"}
                                    </span>
                                    <Switch
                                        checked={app.blocked}
                                        onCheckedChange={() =>
                                            toggleBlock(index)
                                        }
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AIAppsList;
