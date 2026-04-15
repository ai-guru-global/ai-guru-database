import { Link } from "react-router-dom";
import { Settings, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const llmProviders = [
  {
    id: "qwen",
    name: "Qwen",
    description: "Alibaba Cloud's large language model series, offering powerful Chinese language understanding and generation capabilities.",
    icon: "Q",
    href: "/settings/qwen",
  },
  {
    id: "glm",
    name: "GLM",
    description: "Tsinghua University's chat GLM (General Language Model) - a powerful bilingual conversational AI model.",
    icon: "G",
    href: "/settings/glm",
  },
  {
    id: "minimax",
    name: "Minimax",
    description: "Minimax AI's large language model providing advanced reasoning and content generation capabilities.",
    icon: "M",
    href: "/settings/minimax",
  },
  {
    id: "kimi",
    name: "Kimi",
    description: "Moonshot AI's Kimi - supporting 200K context window with powerful long-document understanding.",
    icon: "K",
    href: "/settings/kimi",
  },
];

export function SettingsPage() {
  return (
    <div className="container relative">
      <div className="mx-auto max-w-[980px] py-8">
        <div className="mb-8 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="mb-8 text-muted-foreground">
          Configure your AI model providers. Select a provider to manage their API settings and preferences.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {llmProviders.map((provider) => (
            <Link key={provider.id} to={provider.href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                      {provider.icon}
                    </div>
                    <CardTitle>{provider.name}</CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <CardDescription>{provider.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
