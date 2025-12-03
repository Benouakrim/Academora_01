import { PrismaClient, UserRole, InstitutionType, CampusSetting, TestPolicy, AcademicCalendar, ReviewStatus, ClaimStatus, ReferralStatus, ArticleStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Clean Database (Order matters due to foreign key constraints)
  console.log('🧹 Cleaning database...')
  await prisma.userBadge.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.referral.deleteMany()
  await prisma.universityClaim.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.review.deleteMany()
  await prisma.microContent.deleteMany()
  await prisma.savedUniversity.deleteMany()
  await prisma.comparison.deleteMany()
  await prisma.article.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.staticPage.deleteMany()
  await prisma.universityGroup.deleteMany()
  await prisma.university.deleteMany()
  await prisma.financialProfile.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Database cleaned')

  // 2. Create Users
  console.log('👤 Seeding Users...')
  
  const adminUser = await prisma.user.create({
    data: {
      clerkId: "user_admin_demo_id",
      email: "admin@academora.com",
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      gpa: 4.0,
      satScore: 1600,
      actScore: 36,
      preferredMajor: "Computer Science",
      careerGoals: ["Software Engineer", "Entrepreneur"],
      hobbies: ["Coding", "Chess", "Reading"],
      languagesSpoken: ["English", "Spanish"],
      referralCode: "ADMIN2024",
    }
  })
  console.log(`   ✓ Created admin: ${adminUser.email}`)

  const student1 = await prisma.user.create({
    data: {
      clerkId: "user_student1_demo_id",
      email: "student@test.com",
      firstName: "Alex",
      lastName: "Johnson",
      role: UserRole.USER,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      gpa: 3.8,
      satScore: 1450,
      actScore: 32,
      preferredMajor: "Engineering",
      dreamJobTitle: "Software Engineer",
      careerGoals: ["Build innovative products", "Lead tech teams"],
      preferredLearningStyle: "Hands-on",
      personalityType: "INTJ",
      hobbies: ["Robotics", "Gaming", "Hiking"],
      languagesSpoken: ["English"],
      referralCode: "STUDENT1",
    }
  })
  console.log(`   ✓ Created student 1: ${student1.email}`)

  const student2 = await prisma.user.create({
    data: {
      clerkId: "user_student2_demo_id",
      email: "referrer@test.com",
      firstName: "Sarah",
      lastName: "Williams",
      role: UserRole.USER,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      gpa: 3.9,
      satScore: 1500,
      actScore: 34,
      preferredMajor: "Business",
      dreamJobTitle: "Product Manager",
      careerGoals: ["Launch successful startups", "Mentor others"],
      preferredLearningStyle: "Visual",
      personalityType: "ENFP",
      hobbies: ["Networking", "Travel", "Photography"],
      languagesSpoken: ["English", "French"],
      referralCode: "SARAH2024",
    }
  })
  console.log(`   ✓ Created student 2 (referrer): ${student2.email}`)

  // Create staff users for university claims
  const stanfordStaff = await prisma.user.create({
    data: {
      clerkId: "user_stanford_staff_demo_id",
      email: "staff@stanford.edu",
      firstName: "Michael",
      lastName: "Chen",
      role: UserRole.USER,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      preferredMajor: "Education Administration",
      referralCode: "STAFF001",
    }
  })
  console.log(`   ✓ Created Stanford staff: ${stanfordStaff.email}`)

  const mitStaff = await prisma.user.create({
    data: {
      clerkId: "user_mit_staff_demo_id",
      email: "admissions@mit.edu",
      firstName: "Emily",
      lastName: "Rodriguez",
      role: UserRole.USER,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      preferredMajor: "Higher Education",
      referralCode: "MIT001",
    }
  })
  console.log(`   ✓ Created MIT staff: ${mitStaff.email}`)

  // 3. Create Financial Profiles
  console.log('💰 Seeding Financial Profiles...')
  await prisma.financialProfile.create({
    data: {
      userId: student1.id,
      maxBudget: 50000,
      householdIncome: 120000,
      familySize: 4,
      savings: 30000,
      investments: 15000,
      expectedFamilyContribution: 25000,
      eligibleForPellGrant: false,
      eligibleForStateAid: true,
    }
  })
  console.log('   ✓ Created financial profile for student1')

  // 4. Create Taxonomies (Categories & Tags)
  console.log('📚 Seeding Taxonomies...')
  const categories = [
    { name: "Admissions", slug: "admissions", description: "Tips and guides for getting accepted to universities." },
    { name: "Financial Aid", slug: "financial-aid", description: "Scholarships, grants, and financial assistance information." },
    { name: "Student Life", slug: "student-life", description: "Campus culture, housing, and student experiences." },
    { name: "International Students", slug: "international-students", description: "Visa information and resources for international applicants." },
  ]

  const tags = [
    { name: "Engineering", slug: "engineering" },
    { name: "Ivy League", slug: "ivy-league" },
    { name: "Public Ivy", slug: "public-ivy" },
    { name: "Study Abroad", slug: "study-abroad" },
    { name: "STEM", slug: "stem" },
    { name: "Scholarships", slug: "scholarships" },
  ]

  const createdCategories = await Promise.all(
    categories.map(c => prisma.category.create({ data: c }))
  )
  const createdTags = await Promise.all(
    tags.map(t => prisma.tag.create({ data: t }))
  )
  console.log(`   ✓ Created ${createdCategories.length} categories and ${createdTags.length} tags`)

  // 5. Create Universities (with all new admission fields)
  console.log('🏫 Seeding Universities...')
  const universities = [
    {
      name: "Massachusetts Institute of Technology",
      slug: "mit",
      shortName: "MIT",
      description: "A world-class research university in Cambridge, Massachusetts, known for engineering and physical sciences. MIT is renowned for its rigorous academics, cutting-edge research, and innovative culture.",
      city: "Cambridge",
      state: "MA",
      zipCode: "02139",
      country: "USA",
      address: "77 Massachusetts Ave",
      latitude: 42.3601,
      longitude: -71.0942,
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png",
      heroImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
      websiteUrl: "https://www.mit.edu",
      established: 1861,
      
      // Location Metadata
      climateZone: "Temperate",
      nearestAirport: "Boston Logan (BOS)",
      region: "Northeast",
      setting: CampusSetting.URBAN,
      campusSizeAcres: 168,
      
      // Classification
      type: InstitutionType.PRIVATE_NON_PROFIT,
      classification: "Research University",
      
      // Admissions Stats
      acceptanceRate: 0.04,
      applicationFee: 75,
      commonAppAccepted: true,
      applicationDeadline: new Date("2024-01-01"),
      earlyDecisionDeadline: new Date("2023-11-01"),
      testPolicy: TestPolicy.REQUIRED,
      minGpa: 3.8,
      avgGpa: 4.17,
      satMath25: 780,
      satMath75: 800,
      satVerbal25: 730,
      satVerbal75: 780,
      actComposite25: 35,
      actComposite75: 36,
      avgSatScore: 1545,
      avgActScore: 35,
      internationalEngReqs: { 
        toefl: { minimum: 100, recommended: 110 },
        ielts: { minimum: 7.5, recommended: 8.0 }
      },

      // Financials
      tuitionInState: 57986,
      tuitionOutState: 57986,
      tuitionInternational: 57986,
      roomAndBoard: 18790,
      booksAndSupplies: 1000,
      costOfLiving: 2000,
      percentReceivingAid: 0.58,
      averageGrantAid: 53000,
      averageNetPrice: 15000,
      needBlindAdmission: true,
      scholarshipsIntl: true,

      // Student Body
      studentPopulation: 11934,
      undergraduatePopulation: 4638,
      graduatePopulation: 7296,
      studentFacultyRatio: 3,
      percentMale: 0.51,
      percentFemale: 0.49,
      percentInternational: 0.33,
      diversityScore: 0.85,

      // Outcomes
      graduationRate: 0.95,
      retentionRate: 0.98,
      employmentRate: 0.94,
      averageStartingSalary: 95000,
      internshipSupport: 5,
      alumniNetwork: 5,
      visaDurationMonths: 36,

      // Campus Life
      academicCalendar: AcademicCalendar.SEMESTER,
      sportsDivision: "NCAA Division III",
      hasHousing: true,
      studentLifeScore: 4.5,
      partySceneRating: 3.0,
      safetyRating: 4.8,
      
      // Arrays & Metadata
      popularMajors: ["Computer Science", "Mechanical Engineering", "Mathematics", "Physics", "Electrical Engineering"],
      degreeLevels: ["Bachelor's", "Master's", "PhD"],
      languages: ["English"],
      studentLifeTags: ["Research-focused", "Innovative", "Collaborative", "Tech-oriented"],
      rankings: { usNews: 1, forbes: 2, qs: 1 },
    },
    {
      name: "Stanford University",
      slug: "stanford",
      shortName: "Stanford",
      description: "Located in the heart of Silicon Valley, Stanford is known for its entrepreneurial spirit, academic excellence, and beautiful campus. It's a hub for innovation and startup culture.",
      city: "Stanford",
      state: "CA",
      zipCode: "94305",
      country: "USA",
      address: "450 Serra Mall",
      latitude: 37.4275,
      longitude: -122.1697,
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/1024px-Seal_of_Leland_Stanford_Junior_University.svg.png",
      heroImageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop",
      websiteUrl: "https://www.stanford.edu",
      established: 1885,

      climateZone: "Mediterranean",
      nearestAirport: "San Jose (SJC) / SFO",
      region: "West Coast",
      setting: CampusSetting.SUBURBAN,
      campusSizeAcres: 8180,

      type: InstitutionType.PRIVATE_NON_PROFIT,
      classification: "Research University",

      acceptanceRate: 0.039,
      applicationFee: 90,
      commonAppAccepted: true,
      applicationDeadline: new Date("2024-01-05"),
      earlyDecisionDeadline: new Date("2023-11-01"),
      testPolicy: TestPolicy.OPTIONAL,
      minGpa: 3.8,
      avgGpa: 3.96,
      satMath25: 750,
      satMath75: 800,
      satVerbal25: 720,
      satVerbal75: 770,
      actComposite25: 34,
      actComposite75: 36,
      avgSatScore: 1520,
      avgActScore: 34,
      internationalEngReqs: {
        toefl: { minimum: 100, recommended: 110 },
        ielts: { minimum: 7.0, recommended: 7.5 }
      },

      tuitionInState: 56169,
      tuitionOutState: 56169,
      tuitionInternational: 56169,
      roomAndBoard: 17255,
      booksAndSupplies: 1200,
      costOfLiving: 3000,
      percentReceivingAid: 0.70,
      averageGrantAid: 62000,
      averageNetPrice: 12000,
      needBlindAdmission: true,
      scholarshipsIntl: false,

      studentPopulation: 17680,
      undergraduatePopulation: 7645,
      graduatePopulation: 10035,
      studentFacultyRatio: 5,
      percentMale: 0.50,
      percentFemale: 0.50,
      percentInternational: 0.24,
      diversityScore: 0.88,
      
      graduationRate: 0.94,
      retentionRate: 0.98,
      employmentRate: 0.94,
      averageStartingSalary: 90000,
      internshipSupport: 5,
      alumniNetwork: 5,
      visaDurationMonths: 36,

      academicCalendar: AcademicCalendar.QUARTER,
      sportsDivision: "NCAA Division I",
      hasHousing: true,
      studentLifeScore: 4.8,
      partySceneRating: 4.0,
      safetyRating: 4.5,

      popularMajors: ["Computer Science", "Human Biology", "Economics", "Engineering", "Political Science"],
      degreeLevels: ["Bachelor's", "Master's", "PhD", "JD", "MD"],
      languages: ["English"],
      studentLifeTags: ["Entrepreneurial", "Innovative", "Outdoor activities", "Startup culture"],
      rankings: { usNews: 3, forbes: 1, qs: 3 },
    },
    {
      name: "University of Oxford",
      slug: "oxford",
      shortName: "Oxford",
      description: "The oldest university in the English-speaking world, Oxford offers a unique collegiate system and world-class tutorials. Known for academic rigor and historic traditions.",
      city: "Oxford",
      state: "Oxfordshire",
      zipCode: "OX1 2JD",
      country: "UK",
      address: "Wellington Square",
      latitude: 51.7548,
      longitude: -1.2544,
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1024px-Oxford-University-Circlet.svg.png",
      heroImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop",
      websiteUrl: "https://www.ox.ac.uk",
      established: 1096,

      climateZone: "Maritime",
      nearestAirport: "London Heathrow (LHR)",
      region: "South East England",
      setting: CampusSetting.URBAN,
      campusSizeAcres: 250,

      type: InstitutionType.PUBLIC,
      classification: "Research University",
      academicCalendar: AcademicCalendar.TRIMESTER,

      acceptanceRate: 0.17,
      applicationFee: 25,
      commonAppAccepted: false,
      applicationDeadline: new Date("2023-10-15"),
      testPolicy: TestPolicy.REQUIRED,
      minGpa: 3.7,
      avgGpa: 3.9,
      satMath25: 720,
      satMath75: 780,
      satVerbal25: 700,
      satVerbal75: 760,
      actComposite25: 32,
      actComposite75: 35,
      avgSatScore: 1470,
      avgActScore: 33,
      internationalEngReqs: {
        ielts: { minimum: 7.5, recommended: 8.0 },
        toefl: { minimum: 110, recommended: 115 }
      },

      tuitionInState: 12000,
      tuitionOutState: 45000,
      tuitionInternational: 45000,
      roomAndBoard: 15000,
      booksAndSupplies: 800,
      costOfLiving: 12000,
      percentReceivingAid: 0.40,
      averageGrantAid: 20000,
      averageNetPrice: 35000,
      needBlindAdmission: false,
      scholarshipsIntl: true,

      studentPopulation: 24000,
      undergraduatePopulation: 12000,
      graduatePopulation: 12000,
      studentFacultyRatio: 11,
      percentMale: 0.48,
      percentFemale: 0.52,
      percentInternational: 0.45,
      diversityScore: 0.82,

      graduationRate: 0.98,
      retentionRate: 0.97,
      employmentRate: 0.91,
      averageStartingSalary: 75000,
      internshipSupport: 4,
      alumniNetwork: 5,
      visaDurationMonths: 24,

      sportsDivision: "None",
      hasHousing: true,
      studentLifeScore: 4.2,
      partySceneRating: 3.5,
      safetyRating: 4.9,

      popularMajors: ["Philosophy", "PPE", "Law", "Medicine", "History"],
      degreeLevels: ["Bachelor's", "Master's", "PhD"],
      languages: ["English"],
      studentLifeTags: ["Traditional", "Academic", "Collegiate", "Historic"],
      rankings: { usNews: 5, forbes: 4, qs: 4 },
    },
    {
      name: "Harvard University",
      slug: "harvard",
      shortName: "Harvard",
      description: "One of the world's most prestigious universities, Harvard is known for academic excellence, influential alumni, and rich history dating back to 1636.",
      city: "Cambridge",
      state: "MA",
      zipCode: "02138",
      country: "USA",
      address: "Massachusetts Hall",
      latitude: 42.3770,
      longitude: -71.1167,
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png",
      heroImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop",
      websiteUrl: "https://www.harvard.edu",
      established: 1636,

      climateZone: "Temperate",
      nearestAirport: "Boston Logan (BOS)",
      region: "Northeast",
      setting: CampusSetting.URBAN,
      campusSizeAcres: 209,

      type: InstitutionType.PRIVATE_NON_PROFIT,
      classification: "Research University",

      acceptanceRate: 0.031,
      applicationFee: 85,
      commonAppAccepted: true,
      applicationDeadline: new Date("2024-01-01"),
      earlyDecisionDeadline: new Date("2023-11-01"),
      testPolicy: TestPolicy.OPTIONAL,
      minGpa: 3.9,
      avgGpa: 4.18,
      satMath25: 750,
      satMath75: 800,
      satVerbal25: 730,
      satVerbal75: 780,
      actComposite25: 34,
      actComposite75: 36,
      avgSatScore: 1535,
      avgActScore: 35,
      internationalEngReqs: {
        toefl: { minimum: 100, recommended: 110 },
        ielts: { minimum: 7.5, recommended: 8.0 }
      },

      tuitionInState: 54269,
      tuitionOutState: 54269,
      tuitionInternational: 54269,
      roomAndBoard: 19503,
      booksAndSupplies: 1000,
      costOfLiving: 2500,
      percentReceivingAid: 0.55,
      averageGrantAid: 58000,
      averageNetPrice: 13000,
      needBlindAdmission: true,
      scholarshipsIntl: true,

      studentPopulation: 23100,
      undergraduatePopulation: 7100,
      graduatePopulation: 16200,
      studentFacultyRatio: 6,
      percentMale: 0.49,
      percentFemale: 0.51,
      percentInternational: 0.25,
      diversityScore: 0.87,

      graduationRate: 0.97,
      retentionRate: 0.98,
      employmentRate: 0.95,
      averageStartingSalary: 92000,
      internshipSupport: 5,
      alumniNetwork: 5,
      visaDurationMonths: 36,

      academicCalendar: AcademicCalendar.SEMESTER,
      sportsDivision: "NCAA Division I",
      hasHousing: true,
      studentLifeScore: 4.6,
      partySceneRating: 3.5,
      safetyRating: 4.7,

      popularMajors: ["Economics", "Political Science", "Computer Science", "Psychology", "Social Studies"],
      degreeLevels: ["Bachelor's", "Master's", "PhD", "JD", "MD", "MBA"],
      languages: ["English"],
      studentLifeTags: ["Prestigious", "Academic", "Networking", "Historic"],
      rankings: { usNews: 2, forbes: 3, qs: 2 },
    },
    {
      name: "University of California, Berkeley",
      slug: "uc-berkeley",
      shortName: "UC Berkeley",
      description: "A top public research university known for academic excellence, social activism, and innovation. Located in the San Francisco Bay Area.",
      city: "Berkeley",
      state: "CA",
      zipCode: "94720",
      country: "USA",
      address: "200 California Hall",
      latitude: 37.8719,
      longitude: -122.2585,
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/1200px-Seal_of_University_of_California%2C_Berkeley.svg.png",
      heroImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=600&fit=crop",
      websiteUrl: "https://www.berkeley.edu",
      established: 1868,

      climateZone: "Mediterranean",
      nearestAirport: "San Francisco (SFO) / Oakland (OAK)",
      region: "West Coast",
      setting: CampusSetting.URBAN,
      campusSizeAcres: 1232,

      type: InstitutionType.PUBLIC,
      classification: "Research University",

      acceptanceRate: 0.14,
      applicationFee: 70,
      commonAppAccepted: false,
      applicationDeadline: new Date("2023-11-30"),
      testPolicy: TestPolicy.BLIND,
      minGpa: 3.7,
      avgGpa: 3.89,
      satMath25: 650,
      satMath75: 780,
      satVerbal25: 630,
      satVerbal75: 750,
      actComposite25: 28,
      actComposite75: 34,
      avgSatScore: 1415,
      avgActScore: 31,
      internationalEngReqs: {
        toefl: { minimum: 80, recommended: 100 },
        ielts: { minimum: 6.5, recommended: 7.0 }
      },

      tuitionInState: 14253,
      tuitionOutState: 44206,
      tuitionInternational: 44206,
      roomAndBoard: 17000,
      booksAndSupplies: 1200,
      costOfLiving: 3500,
      percentReceivingAid: 0.65,
      averageGrantAid: 22000,
      averageNetPrice: 18000,
      needBlindAdmission: false,
      scholarshipsIntl: true,

      studentPopulation: 45000,
      undergraduatePopulation: 31000,
      graduatePopulation: 14000,
      studentFacultyRatio: 19,
      percentMale: 0.48,
      percentFemale: 0.52,
      percentInternational: 0.17,
      diversityScore: 0.90,

      graduationRate: 0.91,
      retentionRate: 0.97,
      employmentRate: 0.89,
      averageStartingSalary: 75000,
      internshipSupport: 4,
      alumniNetwork: 5,
      visaDurationMonths: 36,

      academicCalendar: AcademicCalendar.SEMESTER,
      sportsDivision: "NCAA Division I",
      hasHousing: true,
      studentLifeScore: 4.4,
      partySceneRating: 4.2,
      safetyRating: 4.1,

      popularMajors: ["Computer Science", "Economics", "Political Science", "Engineering", "Business"],
      degreeLevels: ["Bachelor's", "Master's", "PhD"],
      languages: ["English"],
      studentLifeTags: ["Activist", "Diverse", "Innovative", "Public"],
      rankings: { usNews: 20, forbes: 15, qs: 27 },
    },
  ]

  const createdUniversities = await Promise.all(
    universities.map(uni => prisma.university.create({ data: uni }))
  )
  console.log(`   ✓ Created ${createdUniversities.length} detailed universities`)

  // 6. Create University Groups
  console.log('🎓 Seeding University Groups...')
  const mit = createdUniversities.find(u => u.slug === 'mit')
  const harvard = createdUniversities.find(u => u.slug === 'harvard')
  
  const ivyLeague = await prisma.universityGroup.create({
    data: {
      name: "Ivy League",
      slug: "ivy-league",
      description: "The eight private institutions of higher education in the Northeastern United States known for academic excellence, selectivity, and social prestige.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/Ivy_League_logo.svg/1200px-Ivy_League_logo.svg.png",
      website: "https://ivyleague.com",
      memberCount: 8,
      universities: {
        connect: [
          ...(mit ? [{ id: mit.id }] : []),
          ...(harvard ? [{ id: harvard.id }] : []),
        ]
      }
    }
  })
  console.log(`   ✓ Created UniversityGroup: ${ivyLeague.name}`)

  // 7. Create Micro-Content
  console.log('💡 Seeding Micro-Content...')
  if (mit) {
    await prisma.microContent.create({
      data: {
        universityId: mit.id,
        category: "application_tips",
        title: "MIT Early Action Advantage",
        content: "MIT strongly encourages applying early action if you're certain about MIT. While it's not binding, acceptance rates are typically higher for EA applicants. Make sure your application showcases your passion for STEM and innovation.",
        priority: 1,
      }
    })

    await prisma.microContent.create({
      data: {
        universityId: mit.id,
        category: "financial_aid",
        title: "Need-Blind Admissions",
        content: "MIT practices need-blind admissions for all applicants, including international students. They meet 100% of demonstrated financial need through grants, scholarships, and work-study programs.",
        priority: 2,
      }
    })
  }

  const stanford = createdUniversities.find(u => u.slug === 'stanford')
  if (stanford) {
    await prisma.microContent.create({
      data: {
        universityId: stanford.id,
        category: "campus_life",
        title: "Silicon Valley Advantage",
        content: "Stanford's location in Silicon Valley provides unparalleled access to tech internships, startup culture, and networking opportunities. Many students intern at major tech companies or start their own ventures.",
        priority: 1,
      }
    })

    await prisma.microContent.create({
      data: {
        universityId: stanford.id,
        category: "application_tips",
        title: "Test-Optional Policy",
        content: "Stanford has adopted a test-optional policy. While strong test scores can still strengthen your application, focus on crafting compelling essays that showcase your unique perspective and experiences.",
        priority: 2,
      }
    })
  }
  console.log('   ✓ Created MicroContent tips')

  // 8. Create Articles
  console.log('📝 Seeding Articles...')
  const admissionsCategory = createdCategories.find(c => c.slug === 'admissions')
  const financialAidCategory = createdCategories.find(c => c.slug === 'financial-aid')
  const engineeringTag = createdTags.find(t => t.slug === 'engineering')
  const scholarshipsTag = createdTags.find(t => t.slug === 'scholarships')

  const article1 = await prisma.article.create({
    data: {
      slug: "complete-guide-to-university-admissions",
      title: "Complete Guide to University Admissions",
      excerpt: "Everything you need to know about applying to top universities, from test scores to essays.",
      content: "Applying to universities can be overwhelming, but with the right strategy, you can maximize your chances of acceptance. This comprehensive guide covers everything from standardized tests to recommendation letters...",
      featuredImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2024-01-15"),
      viewCount: 1250,
      metaTitle: "University Admissions Guide - Academora",
      metaDescription: "Complete guide to university admissions including test scores, essays, and application strategies.",
      authorId: adminUser.id,
      categoryId: admissionsCategory?.id,
      tags: {
        connect: engineeringTag ? [{ id: engineeringTag.id }] : []
      }
    }
  })

  const article2 = await prisma.article.create({
    data: {
      slug: "financial-aid-scholarships-guide",
      title: "Financial Aid and Scholarships: Your Complete Guide",
      excerpt: "Learn how to navigate financial aid applications and find scholarships to fund your education.",
      content: "Paying for college doesn't have to be a barrier. This guide walks you through the financial aid process, from FAFSA to merit scholarships. We'll cover need-based aid, merit scholarships, and tips for maximizing your financial aid package...",
      featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date("2024-02-01"),
      viewCount: 890,
      metaTitle: "Financial Aid Guide - Academora",
      metaDescription: "Complete guide to financial aid and scholarships for college students.",
      authorId: adminUser.id,
      categoryId: financialAidCategory?.id,
      tags: {
        connect: scholarshipsTag ? [{ id: scholarshipsTag.id }] : []
      }
    }
  })

  const article3 = await prisma.article.create({
    data: {
      slug: "international-student-visa-guide",
      title: "International Student Visa Guide",
      excerpt: "Everything international students need to know about visas, work permits, and staying compliant.",
      content: "Navigating visa requirements as an international student can be complex. This guide covers F-1 visas, OPT, CPT, and maintaining your status while studying in the United States...",
      featuredImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop",
      status: ArticleStatus.DRAFT,
      authorId: adminUser.id,
      categoryId: createdCategories.find(c => c.slug === 'international-students')?.id,
    }
  })
  console.log(`   ✓ Created ${3} articles`)

  // 9. Create University Claims (NEW)
  console.log('🏛️ Seeding University Claims...')
  if (stanford && stanfordStaff) {
    await prisma.universityClaim.create({
      data: {
        userId: stanfordStaff.id,
        universityId: stanford.id,
        status: ClaimStatus.PENDING,
        institutionalEmail: "staff@stanford.edu",
        verificationDocuments: [
          "https://example.com/docs/stanford-id-front.jpg",
          "https://example.com/docs/stanford-id-back.jpg"
        ],
        position: "Admissions Counselor",
        department: "Office of Undergraduate Admissions",
        comments: "Pending verification of employment status.",
      }
    })
    console.log('   ✓ Created PENDING claim for Stanford')
  }

  if (mit && mitStaff) {
    await prisma.universityClaim.create({
      data: {
        userId: mitStaff.id,
        universityId: mit.id,
        status: ClaimStatus.VERIFIED,
        institutionalEmail: "admissions@mit.edu",
        verificationDocuments: [
          "https://example.com/docs/mit-verification.pdf"
        ],
        position: "Senior Admissions Officer",
        department: "Office of Admissions",
        comments: "Verified and approved. Can manage university profile.",
      }
    })
    console.log('   ✓ Created VERIFIED claim for MIT')
  }

  // 10. Create Referrals (NEW)
  console.log('🔗 Seeding Referrals...')
  if (student2 && student1) {
    // Update student1 to be referred by student2
    await prisma.user.update({
      where: { id: student1.id },
      data: { referredBy: student2.id }
    })

    await prisma.referral.create({
      data: {
        referrerId: student2.id,
        referredUserId: student1.id,
        status: ReferralStatus.COMPLETED,
        rewardClaimed: true,
      }
    })
    console.log('   ✓ Created referral: referrer@test.com → student@test.com (COMPLETED)')
  }

  // 11. Create Badges (NEW)
  console.log('🏅 Seeding Badges...')
  const earlyBirdBadge = await prisma.badge.create({
    data: {
      slug: "early-bird",
      name: "Early Bird",
      description: "Joined Academora during our early launch phase. Thank you for being one of our first users!",
      iconUrl: "https://example.com/badges/early-bird.svg",
      category: "Milestone",
    }
  })

  const topContributorBadge = await prisma.badge.create({
    data: {
      slug: "top-contributor",
      name: "Top Contributor",
      description: "Made significant contributions to the community through reviews, articles, or helpful comments.",
      iconUrl: "https://example.com/badges/top-contributor.svg",
      category: "Community",
    }
  })

  const ambassadorBadge = await prisma.badge.create({
    data: {
      slug: "ambassador",
      name: "Ambassador",
      description: "Helped grow the Academora community by referring multiple users.",
      iconUrl: "https://example.com/badges/ambassador.svg",
      category: "Referral",
    }
  })
  console.log(`   ✓ Created ${3} badges`)

  // Award "Early Bird" badge to Admin
  await prisma.userBadge.create({
    data: {
      userId: adminUser.id,
      badgeId: earlyBirdBadge.id,
      awardedAt: new Date(),
    }
  })
  console.log('   ✓ Awarded "Early Bird" badge to Admin')

  // Award "Ambassador" badge to student2 (referrer)
  if (student2) {
    await prisma.userBadge.create({
      data: {
        userId: student2.id,
        badgeId: ambassadorBadge.id,
        awardedAt: new Date(),
      }
    })
    console.log('   ✓ Awarded "Ambassador" badge to referrer')
  }

  // 12. Create Sample Reviews
  console.log('⭐ Seeding Reviews...')
  if (mit && adminUser) {
    await prisma.review.create({
      data: {
        userId: adminUser.id,
        universityId: mit.id,
        rating: 5.0,
        academicRating: 5.0,
        campusRating: 4.0,
        socialRating: 3.0,
        careerRating: 5.0,
        title: "Intense but rewarding",
        content: "MIT is exactly as hard as they say it is, but the opportunities are endless. The research opportunities, faculty support, and career outcomes are unmatched. The workload is intense, but you'll learn more than you ever thought possible.",
        status: ReviewStatus.APPROVED,
        helpfulCount: 42,
        verified: true,
        anonymous: false,
      }
    })
  }

  if (stanford && student1) {
    await prisma.review.create({
      data: {
        userId: student1.id,
        universityId: stanford.id,
        rating: 4.5,
        academicRating: 5.0,
        campusRating: 5.0,
        socialRating: 4.0,
        careerRating: 5.0,
        title: "Beautiful campus, amazing opportunities",
        content: "Stanford's campus is absolutely stunning, and the proximity to Silicon Valley is incredible for internships and networking. The academics are rigorous but the support system is strong.",
        status: ReviewStatus.APPROVED,
        helpfulCount: 28,
        verified: false,
        anonymous: false,
      }
    })
  }
  console.log('   ✓ Created sample reviews')

  // 13. Create Saved Universities
  console.log('📌 Seeding Saved Universities...')
  if (student1 && mit && stanford) {
    await prisma.savedUniversity.create({
      data: {
        userId: student1.id,
        universityId: mit.id,
        status: "PLANNED",
        notes: "Dream school - need to improve SAT scores",
      }
    })

    await prisma.savedUniversity.create({
      data: {
        userId: student1.id,
        universityId: stanford.id,
        status: "APPLIED",
        notes: "Applied early action - waiting for decision",
      }
    })
  }
  console.log('   ✓ Created saved universities')

  console.log('✅ Seeding complete!')
  console.log('\n📊 Summary:')
  console.log(`   • Users: ${await prisma.user.count()}`)
  console.log(`   • Universities: ${await prisma.university.count()}`)
  console.log(`   • Articles: ${await prisma.article.count()}`)
  console.log(`   • University Claims: ${await prisma.universityClaim.count()}`)
  console.log(`   • Referrals: ${await prisma.referral.count()}`)
  console.log(`   • Badges: ${await prisma.badge.count()}`)
  console.log(`   • User Badges: ${await prisma.userBadge.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
