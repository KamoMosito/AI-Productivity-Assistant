import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Responsible AI — Rooted AI" },
      {
        name: "description",
        content:
          "Profile, preferences, responsible AI guidance, POPIA-conscious privacy notes and about Rooted AI.",
      },
      { property: "og:title", content: "Settings & Responsible AI — Rooted AI" },
      {
        property: "og:description",
        content: "Responsible AI and privacy guidance for the Rooted With Care team.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Rooted With Care");
  const [email, setEmail] = useState("team@rootedwithcare.example");
  const [autoDisclaimer, setAutoDisclaimer] = useState(true);
  const [saveDrafts, setSaveDrafts] = useState(false);

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences and how Rooted AI is used responsibly."
        accent="sage"
      />

      <Tabs defaultValue="profile">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="responsible">Responsible AI</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <section className="surface-card space-y-4 p-5">
            <div className="space-y-2">
              <Label htmlFor="name">Business name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={() => toast.success("Profile saved (demo only)")}>Save profile</Button>
          </section>
        </TabsContent>

        <TabsContent value="preferences">
          <section className="surface-card space-y-5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Always show the AI disclaimer</p>
                <p className="text-xs text-muted-foreground">
                  Keeps the review reminder under every AI output.
                </p>
              </div>
              <Switch checked={autoDisclaimer} onCheckedChange={setAutoDisclaimer} aria-label="Always show the AI disclaimer" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Keep drafts in this session</p>
                <p className="text-xs text-muted-foreground">
                  Demo preference — nothing is stored on a server.
                </p>
              </div>
              <Switch checked={saveDrafts} onCheckedChange={setSaveDrafts} aria-label="Keep drafts in this session" />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="responsible">
          <section className="surface-card space-y-5 p-5 text-sm leading-relaxed">
            <div>
              <h2 className="text-base font-semibold">Human review</h2>
              <p className="mt-1 text-muted-foreground">
                Every Rooted AI output is a draft. A person must read, edit and approve it before it
                is sent to a customer, supplier or partner.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold">AI limitations</h2>
              <p className="mt-1 text-muted-foreground">
                AI can misread context, miss nuance and produce confident but incorrect text. It
                does not know anything about your business beyond what you type in.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold">Accuracy verification</h2>
              <p className="mt-1 text-muted-foreground">
                Check names, dates, prices, quantities and commitments against your own records.
                Rooted AI is instructed never to invent them and to use [placeholders] instead.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold">Bias awareness</h2>
              <p className="mt-1 text-muted-foreground">
                AI reflects patterns in its training data and may carry cultural or gender bias.
                Review customer-facing language for tone and inclusivity.
              </p>
            </div>
            <div>
              <h2 className="text-base font-semibold">Product claims</h2>
              <p className="mt-1 text-muted-foreground">
                Distinguish business-provided positioning ("Relief. Hydration. Growth."), AI-generated
                suggestions, and independently verified scientific or medical information. Do not
                publish unsupported medical claims about the Scalp Relief &amp; Growth Oil or
                Hydrating Scalp Mist.
              </p>
            </div>
            <p className="rounded-xl bg-peach-soft px-4 py-3 text-xs">
              AI-generated content. Please review this output before using it for business
              decisions. AI can make mistakes and should not replace human judgment.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="privacy">
          <section className="surface-card space-y-4 p-5 text-sm leading-relaxed">
            <h2 className="text-base font-semibold">Do not enter into Rooted AI</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Passwords or login credentials</li>
              <li>Payment or banking information</li>
              <li>Identity documents or ID numbers</li>
              <li>Confidential business information</li>
              <li>Unnecessary customer personal information</li>
            </ul>
            <h2 className="text-base font-semibold">POPIA-conscious guidance</h2>
            <p className="text-muted-foreground">
              South Africa's Protection of Personal Information Act encourages collecting the
              minimum personal information needed, using it only for the purpose it was given, and
              keeping it secure. Anonymise customer details before pasting them here — for example
              use "Customer A" instead of a full name. This guidance is informational and does not
              claim or guarantee legal compliance; consult a qualified advisor for that.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="about">
          <section className="surface-card space-y-4 p-5 text-sm leading-relaxed">
            <Logo showTagline />
            <p className="text-muted-foreground">
              Rooted AI is an internal workplace productivity platform built for Rooted With Care, a
              small South African hair-care business positioned around relief, hydration and growth.
              It is not an online store — it exists to automate repetitive workplace tasks like
              writing emails, summarising meetings and planning the week.
            </p>
            <div className="rounded-2xl bg-muted p-4 text-muted-foreground">
              <p className="font-medium text-foreground">Business context used by the AI</p>
              <p className="mt-1">
                Products: Scalp Relief &amp; Growth Oil, Hydrating Scalp Mist · 50ml · cost R32.40 ·
                selling price R80 · profit R47.60 per bottle.
              </p>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
