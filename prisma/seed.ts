import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, addHours } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with NATX baseline data...');

  const memberPassword = await bcrypt.hash('Member2025!', 10);
  const adminPassword = await bcrypt.hash('Admin2025!Secure', 10);

  const member = await prisma.user.upsert({
    where: { email: 'member@natxtest.com' },
    update: {},
    create: {
      email: 'member@natxtest.com',
      passwordHash: memberPassword,
      firstName: 'Jordan',
      lastName: 'Lee',
      role: 'MEMBER',
      status: 'ACTIVE',
      title: 'Director of Innovation',
      company: 'NATX Ventures',
      bio: 'Focused on enterprise transformation through emerging technologies.',
      region: 'WEST',
      industry: 'SAAS',
      memberSince: addDays(new Date(), -420),
      linkedinUrl: 'https://www.linkedin.com/in/jordanlee',
      avatarUrl: 'https://images.unsplash.com/photo-1528892952291-009c663ce843'
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@natxtest.com' },
    update: {},
    create: {
      email: 'admin@natxtest.com',
      passwordHash: adminPassword,
      firstName: 'Alex',
      lastName: 'Morgan',
      role: 'ADMIN',
      status: 'ACTIVE',
      title: 'Head of Member Success',
      company: 'NATX',
      bio: 'Ensuring members get the most out of the NATX network and programs.',
      region: 'NORTH',
      industry: 'OTHER',
      memberSince: addDays(new Date(), -720),
      linkedinUrl: 'https://www.linkedin.com/in/alexmorgan',
      avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe'
    }
  });

  await prisma.memberProfile.deleteMany();

  const members = [
    {
      fullName: 'Jordan Lee',
      title: 'Director of Innovation',
      company: 'NATX Ventures',
      bio: 'Driving digital transformation across the NATX portfolio.',
      profilePhoto: member.avatarUrl,
      email: 'member@natxtest.com',
      linkedinUrl: 'https://www.linkedin.com/in/jordanlee',
      region: 'WEST',
      industry: 'SAAS',
      memberSince: member.memberSince,
      online: true
    },
    {
      fullName: 'Priya Desai',
      title: 'Chief Technology Officer',
      company: 'Helios Health',
      bio: 'Leading AI adoption in healthcare to improve patient outcomes.',
      profilePhoto: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
      email: 'priya.desai@helioshealth.com',
      linkedinUrl: 'https://www.linkedin.com/in/priyadesai',
      region: 'SOUTH',
      industry: 'HEALTHCARE',
      memberSince: addDays(new Date(), -300),
      online: true
    },
    {
      fullName: 'Marcus Chen',
      title: 'VP of Product',
      company: 'Skyline Commerce',
      bio: 'Scaling omnichannel experiences across global retail brands.',
      profilePhoto: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d',
      email: 'marcus.chen@skylinecommerce.com',
      linkedinUrl: 'https://www.linkedin.com/in/marcuschen',
      region: 'CENTRAL',
      industry: 'ECOMMERCE',
      memberSince: addDays(new Date(), -180),
      online: false
    },
    {
      fullName: 'Elena Rossi',
      title: 'Head of AI Strategy',
      company: 'QuantumEdge',
      bio: 'Building responsible AI frameworks that unlock enterprise value.',
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      email: 'elena.rossi@quantumedge.ai',
      linkedinUrl: 'https://www.linkedin.com/in/elenarossi',
      region: 'EAST',
      industry: 'FINTECH',
      memberSince: addDays(new Date(), -520),
      online: false
    }
  ];

  await prisma.memberProfile.createMany({
    data: members
  });

  await prisma.event.deleteMany();

  const baseDate = new Date();
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'NATX Leadership Summit: AI & Enterprise Strategy',
        slug: 'natx-leadership-summit-ai-enterprise',
        description:
          'A curated session for technology leaders exploring the practicalities of AI adoption across the enterprise.',
        featuredImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        eventType: 'Summit',
        location: 'NATX Innovation Hub, Austin TX',
        startAt: addDays(baseDate, 7),
        endAt: addDays(addHours(baseDate, 8), 7),
        status: 'UPCOMING',
        capacity: 60
      }
    }),
    prisma.event.create({
      data: {
        title: 'C-Suite Roundtable: Cybersecurity Posture 2025',
        slug: 'c-suite-roundtable-cybersecurity-2025',
        description:
          'Invite-only roundtable to align on the latest threat intelligence and board reporting expectations.',
        featuredImage: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
        eventType: 'Roundtable',
        location: 'Virtual Event',
        startAt: addDays(baseDate, 14),
        endAt: addDays(addHours(baseDate, 2), 14),
        status: 'UPCOMING',
        capacity: 25
      }
    }),
    prisma.event.create({
      data: {
        title: 'Member Spotlight: Scaling Platforms Globally',
        slug: 'member-spotlight-scaling-platforms',
        description:
          'Case study walkthrough featuring NATX members expanding platforms across three continents.',
        featuredImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
        eventType: 'Spotlight',
        location: 'Online Broadcast',
        startAt: addDays(baseDate, 28),
        endAt: addDays(addHours(baseDate, 1), 28),
        status: 'UPCOMING',
        capacity: 200
      }
    })
  ]);

  await prisma.eventRegistration.deleteMany();
  await prisma.eventRegistration.create({
    data: {
      userId: member.id,
      eventId: events[0].id
    }
  });

  await prisma.resource.deleteMany();
  await prisma.resource.createMany({
    data: [
      {
        title: 'Board Brief: AI Adoption Playbook',
        slug: 'ai-adoption-playbook',
        category: 'Strategy',
        resourceType: 'PDF',
        description:
          'A board-ready brief covering AI trends, investment signals, and enterprise adoption frameworks.',
        fileUrl: 'https://cdn.thenatx.com/resources/ai-adoption-playbook.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        tags: JSON.stringify(['AI', 'Strategy', 'Board']),
        status: 'PUBLISHED'
      },
      {
        title: 'Benchmark: Enterprise SaaS Metrics 2025',
        slug: 'enterprise-saas-metrics-2025',
        category: 'Benchmark',
        resourceType: 'Report',
        description:
          'Quarterly benchmarking data sourced from NATX member companies on product-led growth.',
        externalUrl: 'https://thenatx.com/resources/enterprise-saas-metrics-2025',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
        tags: JSON.stringify(['SaaS', 'KPIs', 'Benchmark']),
        status: 'PUBLISHED'
      },
      {
        title: 'Playbook: Executive Onboarding for CTOs',
        slug: 'executive-onboarding-cto',
        category: 'Playbook',
        resourceType: 'Guide',
        description:
          'A 90-day onboarding framework tailored for technology leaders joining new organizations.',
        fileUrl: 'https://cdn.thenatx.com/resources/executive-onboarding-cto.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        tags: JSON.stringify(['Leadership', 'Onboarding']),
        status: 'PUBLISHED'
      }
    ]
  });

  console.log('✅ Seed data inserted successfully.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
