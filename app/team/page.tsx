import Image from "next/image";
import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { MotionInView } from "@/components/motion-in-view";

export const metadata = {
  title: "Our Team",
  description: "Meet the people behind RantAI.",
};

export default async function TeamPage() {
  const members = await db.select().from(teamMembers).orderBy(asc(teamMembers.orderIndex));

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <MotionInView>
            <div className="mx-auto max-w-7xl">
              <Badge variant="outline" className="mb-4 uppercase">Our Team</Badge>
              <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                The People Behind RantAI
              </h1>
              <p className="mt-6 max-w-2xl font-mono leading-relaxed text-muted-foreground">
                A team of engineers, researchers, and builders dedicated to advancing enterprise AI.
              </p>
            </div>
          </MotionInView>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            {members.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">Team info coming soon.</p>
            ) : (
              <MotionInView transition={{ delay: 0.1 }}>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex flex-col gap-4">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        {member.bio && (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                        )}
                        <div className="mt-3 flex gap-3">
                          {member.linkedin && (
                            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                              <LinkedinIcon className="size-4" />
                            </Link>
                          )}
                          {member.github && (
                            <Link href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                              <GithubIcon className="size-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionInView>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
