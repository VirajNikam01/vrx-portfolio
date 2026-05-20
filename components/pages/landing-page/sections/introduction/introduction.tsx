export function Introduction() {
    return (
        <section className="flex min-h-dvh items-center justify-center px-6 py-24">
            <div className="w-full max-w-xl space-y-4">
                <p className="text-sm tracking-widest uppercase text-muted-foreground">
                    Software Developer
                </p>
                <h1 className="text-5xl font-medium tracking-tight">I&apos;m Viraj.</h1>
                <p className="text-base leading-relaxed text-muted-foreground">
                    I specialize in crafting elegant and efficient web applications -
                    blending strong JavaScript fundamentals with a keen eye for design to
                    create seamless user experiences that are both intuitive and
                    performant.
                </p>
                <div className="flex items-center gap-4 pt-2">
                    <a
                        href="#experience"
                        className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
                    >
                        View my work
                    </a>
                    <span className="text-muted-foreground">/</span>
                    <button className="text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-60">
                        Get in touch
                    </button>
                </div>
            </div>
        </section>
    );
}
