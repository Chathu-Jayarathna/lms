import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting PostgreSQL database seeding for TGL LMS...");

  // 1. Create Default Instructor & Sample Student
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const instructor = await prisma.user.upsert({
    where: { email: "instructor@tgl.edu" },
    update: {},
    create: {
      name: "Dr. Elena Rostova",
      email: "instructor@tgl.edu",
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          bio: "Senior Employability Consultant and Computer Science Lead Trainer at Thakral Global Learning.",
          targetJobRole: "Principal Instructor",
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@tgl.edu" },
    update: {},
    create: {
      name: "Alex Morgan",
      email: "student@tgl.edu",
      passwordHash: hashedPassword,
      role: Role.STUDENT,
      profile: {
        create: {
          bio: "BSc (Hons) Computer Science Final Year Candidate.",
          targetJobRole: "Full-Stack Software Engineer",
        },
      },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@tgl.edu" },
    update: { role: Role.ADMIN },
    create: {
      name: "Sarah Jenkins",
      email: "admin@tgl.edu",
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          bio: "Institutional Administrator at Thakral Global Learning.",
          targetJobRole: "Administrator",
        },
      },
    },
  });

  console.log(`Created Instructor (${instructor.email}), Admin (${admin.email}) & Student (${student.email})`);

  // 2. Define 8 Employability Courses
  const coursesData = [
    {
      title: "Communication Skills for Employability",
      slug: "communication-skills-for-employability",
      category: "Soft Skills",
      level: "Beginner",
      description: "Master executive oral presentation, professional technical writing, and active listening for global corporate environments.",
      imageUrl: "/images/communication.jpg",
      modules: [
        {
          title: "Module 1: Professional Technical Speaking",
          lessons: [
            {
              title: "Articulating Complex Architecture to Non-Technical Stakeholders",
              durationMins: 15,
              content: "Effective communication starts with translating dense technical jargon into clear business value outcomes. Learn the inverted pyramid framework for executive summaries.",
            },
            {
              title: "Active Listening and Client Requirement Gathering",
              durationMins: 20,
              content: "How to conduct client discovery sessions, validate requirements, and handle constructive feedback during sprint reviews.",
            },
          ],
        },
        {
          title: "Module 2: Written Communication Standards",
          lessons: [
            {
              title: "Crafting Professional Technical Emails & Documentation",
              durationMins: 18,
              content: "Structure bug reports, technical RFCs, and client updates with clarity, tone control, and concise formatting.",
            },
          ],
        },
      ],
    },
    {
      title: "Teamwork & Cross-Functional Collaboration",
      slug: "teamwork-and-cross-functional-collaboration",
      category: "Soft Skills",
      level: "Intermediate",
      description: "Excel in agile development teams, resolve team friction, and collaborate seamlessly across engineering and business units.",
      imageUrl: "/images/teamwork.jpg",
      modules: [
        {
          title: "Module 1: Agile Team Dynamics",
          lessons: [
            {
              title: "Navigating Scrum Standups and Retrospectives",
              durationMins: 15,
              content: "Learn how to contribute constructively during daily standups, sprint planning, and blameless retrospectives.",
            },
            {
              title: "Conflict Resolution in Pair Programming & Code Reviews",
              durationMins: 25,
              content: "Best practices for giving empathetic, actionable code review feedback without offending peers.",
            },
          ],
        },
      ],
    },
    {
      title: "Workplace Leadership Skills",
      slug: "workplace-leadership-skills",
      category: "Leadership",
      level: "Intermediate",
      description: "Develop strategic initiative, mentor junior developers, and drive technical projects to successful delivery.",
      imageUrl: "/images/leadership.jpg",
      modules: [
        {
          title: "Module 1: Leading Without Authority",
          lessons: [
            {
              title: "Building Technical Influence & Consensus",
              durationMins: 20,
              content: "How to propose technical improvements and architecture refactors by aligning engineering goals with product roadmaps.",
            },
          ],
        },
      ],
    },
    {
      title: "Time Management & Productivity",
      slug: "time-management-and-productivity",
      category: "Personal Development",
      level: "Beginner",
      description: "Prioritize high-impact development tasks, manage deep work schedules, and consistently hit project deadlines.",
      imageUrl: "/images/productivity.jpg",
      modules: [
        {
          title: "Module 1: Deep Work for Engineers",
          lessons: [
            {
              title: "Time Blocking and Minimizing Context Switching",
              durationMins: 15,
              content: "Strategies to protect coding focus blocks, manage Slack/email notifications, and eliminate developer cognitive burnout.",
            },
          ],
        },
      ],
    },
    {
      title: "Analytical Problem Solving",
      slug: "analytical-problem-solving",
      category: "Technical Skills",
      level: "Advanced",
      description: "Deconstruct complex software bugs, analyze root causes, and evaluate algorithmic trade-offs under high load.",
      imageUrl: "/images/problem-solving.jpg",
      modules: [
        {
          title: "Module 1: Systemic Root Cause Analysis",
          lessons: [
            {
              title: "The 5 Whys Technique & Incident Post-Mortems",
              durationMins: 22,
              content: "Step-by-step diagnostic workflows for investigating production outages, memory leaks, and race conditions.",
            },
          ],
        },
      ],
    },
    {
      title: "Critical Thinking for Technical Professionals",
      slug: "critical-thinking-for-technical-professionals",
      category: "Technical Skills",
      level: "Intermediate",
      description: "Evaluate architecture decisions, analyze trade-offs between SQL vs NoSQL, and audit system security risks.",
      imageUrl: "/images/critical-thinking.jpg",
      modules: [
        {
          title: "Module 1: Architectural Trade-Off Analysis",
          lessons: [
            {
              title: "Evaluating Monolith vs Microservices Architecture",
              durationMins: 25,
              content: "Objective criteria for selecting system boundaries, data consistency models, and network overhead budgets.",
            },
          ],
        },
      ],
    },
    {
      title: "Technical & Behavioral Interview Preparation",
      slug: "technical-and-behavioral-interview-prep",
      category: "Career Prep",
      level: "Intermediate",
      description: "Conquer live coding challenges, system design interviews, and behavioral STAR questions with confidence.",
      imageUrl: "/images/interview-prep.jpg",
      modules: [
        {
          title: "Module 1: Behavioral STAR Interview Framework",
          lessons: [
            {
              title: "Structuring Situation, Task, Action, and Result Answers",
              durationMins: 20,
              content: "How to craft compelling 2-minute interview stories highlighting technical initiative and teamwork.",
            },
            {
              title: "Navigating Live Whiteboard Coding Challenges",
              durationMins: 30,
              content: "Thinking out loud, handling edge cases, and communicating Big-O time and space complexity to interviewers.",
            },
          ],
        },
      ],
    },
    {
      title: "CV & Resume Development Strategy",
      slug: "cv-and-resume-development-strategy",
      category: "Career Prep",
      level: "Beginner",
      description: "Build an ATS-optimized software engineering resume that highlights quantitative project achievements.",
      imageUrl: "/images/cv-prep.jpg",
      modules: [
        {
          title: "Module 1: ATS Optimization & Resume Structuring",
          lessons: [
            {
              title: "Formatting Bullet Points with Action Verbs & Metrics",
              durationMins: 18,
              content: "Transforming vague project descriptions into high-impact metric statements (e.g. Improved query performance by 40%).",
            },
          ],
        },
      ],
    },
  ];

  for (const courseItem of coursesData) {
    const course = await prisma.course.upsert({
      where: { slug: courseItem.slug },
      update: {
        title: courseItem.title,
        description: courseItem.description,
        category: courseItem.category,
        level: courseItem.level,
        isPublished: true,
      },
      create: {
        title: courseItem.title,
        slug: courseItem.slug,
        description: courseItem.description,
        category: courseItem.category,
        level: courseItem.level,
        isPublished: true,
        imageUrl: courseItem.imageUrl,
        instructorId: instructor.id,
      },
    });

    let modOrder = 1;
    for (const modItem of courseItem.modules) {
      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: modItem.title,
          order: modOrder++,
        },
      });

      let lessonOrder = 1;
      for (const lesItem of modItem.lessons) {
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lesItem.title,
            content: lesItem.content,
            durationMins: lesItem.durationMins,
            order: lessonOrder++,
          },
        });
      }
    }
    console.log(`Seeded Course: ${course.title}`);
  }

  console.log("Database seeding completed successfully! 🚀");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
