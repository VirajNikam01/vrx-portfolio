import type { NewRecommendation } from "@/lib/db/schema/recommendations";

export const recommendationsSeedData: NewRecommendation[] = [
    {
        slug: "the-pragmatic-programmer",
        type: "book",
        category: "tech",
        title: "The Pragmatic Programmer",
        author: "David Thomas & Andrew Hunt",
        description:
            "Timeless advice on software craftsmanship — from career tips to code hygiene.",
        coverImageUrl: null,
        externalUrl:
            "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
        notes: `# The Pragmatic Programmer

## Why I recommend it

This book changed how I think about software — not just how to write it, but how to *care* about it. Every chapter gives you a mental model you can apply immediately.

## Key ideas

- **DRY (Don't Repeat Yourself)** — Every piece of knowledge must have a single, authoritative representation.
- **Tracer Bullets** — Ship thin, end-to-end slices early so you can aim before you build.
- **Rubber Duck Debugging** — Explaining your problem out loud often reveals the solution before anyone answers.

## My takeaway

Pragmatic programmers treat their craft like a trade — always sharpening the tools, always improving. This book is the best primer I've found for that mindset.`,
        isFeatured: true,
        isVisible: true,
        sortOrder: 1,
    },
    {
        slug: "clean-code",
        type: "book",
        category: "tech",
        title: "Clean Code",
        author: "Robert C. Martin",
        description:
            "A handbook of agile software craftsmanship focused on writing readable, maintainable code.",
        coverImageUrl: null,
        externalUrl:
            "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
        notes: `# Clean Code

## Why I recommend it

Uncle Bob's blunt writing style makes every principle stick. The book is full of real refactoring examples that show — not just tell — what clean code looks like.

## Key ideas

- **Meaningful names** — Variables, functions, and classes should reveal intent.
- **Small functions** — A function should do one thing. If you can extract a block with a descriptive name, do it.
- **Comments are a failure** — If you need a comment, the code isn't clear enough.

## My takeaway

Some rules are overly strict, but the underlying principle — *code is read far more often than it is written* — is indisputable. Worth revisiting every year.`,
        isFeatured: false,
        isVisible: true,
        sortOrder: 2,
    },
    {
        slug: "meditations",
        type: "book",
        category: "philosophy",
        title: "Meditations",
        author: "Marcus Aurelius",
        description:
            "Personal journal of a Roman emperor — Stoic philosophy at its most intimate.",
        coverImageUrl: null,
        externalUrl:
            "https://www.amazon.com/Meditations-New-Translation-Marcus-Aurelius/dp/0812968255",
        notes: `# Meditations

## Why I recommend it

Marcus Aurelius wrote this for himself — no audience, no agenda. That makes it the most honest philosophy book I've read.

## Key ideas

- **The dichotomy of control** — Focus only on what you can influence. Everything else is noise.
- **Memento mori** — Remembering impermanence makes the present more vivid.
- **Amor fati** — Love what happens. Not just accept it — love it.

## My takeaway

I return to specific passages when I'm stressed about things outside my control. It's a compass, not a rulebook.`,
        isFeatured: true,
        isVisible: true,
        sortOrder: 3,
    },
    {
        slug: "mans-search-for-meaning",
        type: "book",
        category: "philosophy",
        title: "Man's Search for Meaning",
        author: "Viktor E. Frankl",
        description:
            "A psychiatrist's account of surviving the Holocaust and the philosophy of meaning that emerged.",
        coverImageUrl: null,
        externalUrl:
            "https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273",
        notes: `# Man's Search for Meaning

## Why I recommend it

Frankl survived Auschwitz and still found reason for hope. His framework — logotherapy — is built around the idea that the drive to find meaning is more fundamental than pleasure or power.

## Key ideas

- **Meaning in suffering** — Even unavoidable suffering can be given meaning.
- **Response-ability** — Between stimulus and response there is a space. In that space lies our freedom.
- **Provisional existence** — The uncertainty of the future can itself become a source of purpose.

## My takeaway

This book reframes complaints. Whenever I catch myself dramatising minor hardship, Frankl's voice cuts through.`,
        isFeatured: false,
        isVisible: true,
        sortOrder: 4,
    },
    {
        slug: "atomic-habits",
        type: "book",
        category: "other",
        title: "Atomic Habits",
        author: "James Clear",
        description:
            "An evidence-based system for building good habits and breaking bad ones.",
        coverImageUrl: null,
        externalUrl:
            "https://jamesclear.com/atomic-habits",
        notes: `# Atomic Habits

## Why I recommend it

The best productivity book I've read — because it never asks you to rely on motivation. It redesigns the environment instead.

## Key ideas

- **1% better every day** — Small improvements compound over time.
- **Identity-based habits** — Focus on who you want to become, not what you want to achieve.
- **The habit loop** — Cue → Craving → Response → Reward. Changing any link changes the habit.

## My takeaway

I restructured my morning routine using the two-minute rule and habit stacking. The results were dramatic within a month.`,
        isFeatured: false,
        isVisible: true,
        sortOrder: 5,
    },
    {
        slug: "deep-work",
        type: "book",
        category: "other",
        title: "Deep Work",
        author: "Cal Newport",
        description:
            "The case for focused, distraction-free work and a practical guide to achieving it.",
        coverImageUrl: null,
        externalUrl:
            "https://calnewport.com/deep-work/",
        notes: `# Deep Work

## Why I recommend it

Cal Newport makes a strong argument that the ability to focus without distraction is becoming increasingly rare and increasingly valuable.

## Key ideas

- **Deep vs shallow work** — Shallow work is easy to replicate; deep work is where value is created.
- **The 4 philosophies** — Monastic, bimodal, rhythmic, and journalistic approaches to scheduling deep work.
- **Quit social media** — At least evaluate it honestly: what does it actually add?

## My takeaway

I now schedule deep work blocks as actual calendar events. The difference in output quality is real.`,
        isFeatured: false,
        isVisible: true,
        sortOrder: 6,
    },
    {
        slug: "cs50-introduction-to-computer-science",
        type: "course",
        category: "tech",
        title: "CS50: Introduction to Computer Science",
        author: "David J. Malan — Harvard / edX",
        description:
            "Harvard's legendary intro to CS — covers C, Python, SQL, web, and more. The best free course on the internet.",
        coverImageUrl: null,
        externalUrl: "https://cs50.harvard.edu/x/",
        notes: `# CS50x — Introduction to Computer Science

## Why I recommend it

CS50 is the one course I would give to any aspiring developer regardless of their background. Professor Malan's ability to make hard things simple is unmatched.

## What you'll learn

- Memory management in C
- Data structures and algorithms
- Python fundamentals
- SQL and relational databases
- HTML, CSS, JavaScript, and Flask

## My experience

Problem sets are genuinely hard. The final project gives you real creative freedom. Completing it felt like a rite of passage.`,
        isFeatured: true,
        isVisible: true,
        sortOrder: 7,
    },
    {
        slug: "the-missing-semester-of-cs-education",
        type: "course",
        category: "tech",
        title: "The Missing Semester of Your CS Education",
        author: "MIT",
        description:
            "Everything universities skip — shell, Vim, Git, debugging, profiling, and more.",
        coverImageUrl: null,
        externalUrl: "https://missing.csail.mit.edu/",
        notes: `# The Missing Semester

## Why I recommend it

No CS curriculum teaches you to use your tools properly. This free MIT course fills that gap in 11 lectures.

## What you'll learn

- Shell scripting and automation
- Vim — the editor that pays dividends forever
- Git internals (not just \`git commit\`)
- Debugging and profiling tools
- Security and cryptography basics

## My takeaway

After this course I automated half my repetitive dev tasks. The Vim lecture alone was worth a week of productivity gains.`,
        isFeatured: false,
        isVisible: true,
        sortOrder: 8,
    },
    {
        slug: "fullstackopen",
        type: "course",
        category: "tech",
        title: "Full Stack Open",
        author: "University of Helsinki",
        description:
            "Comprehensive free course covering React, Node, TypeScript, GraphQL, and CI/CD.",
        coverImageUrl: null,
        externalUrl: "https://fullstackopen.com/en/",
        notes: `# Full Stack Open

## Why I recommend it

This is the most practical and up-to-date free web development curriculum I've found. It treats you like an adult.

## What you'll learn

- React (including hooks, Redux, React Query)
- Node.js and Express
- TypeScript
- Testing (Jest, Cypress)
- GraphQL, CI/CD, Docker

## My takeaway

The exercises build a real application from scratch. By the end you have both knowledge and working code to show.`,
        isFeatured: false,
        isVisible: true,
        sortOrder: 9,
    },
];
