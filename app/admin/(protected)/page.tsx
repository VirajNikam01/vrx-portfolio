import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-session";
import { adminModules } from "@/config/admin-modules";

export default async function AdminHome() {
    await requireAdminPage();
    return <section className="space-y-8"><div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Manage website</h1><p className="mt-3 text-sm text-muted-foreground">Choose a module to manage its content and settings.</p></div><div className="grid gap-5 md:grid-cols-2">{adminModules.map(module => <Link key={module.id} href={module.href} className="rounded-2xl border border-border bg-card p-6 outline-none transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"><h2 className="text-xl font-semibold">{module.title}<span aria-hidden className="ml-2 text-primary">↗</span></h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{module.description}</p></Link>)}</div></section>;
}
