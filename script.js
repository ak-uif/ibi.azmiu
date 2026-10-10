/**
 * AzMİU İBİ (Innovative Business Incubator) Core Application Engine
 * Dual-language system (AZ / EN), dynamic modal controller (4 distinct forms),
 * interactive timeline, filters, count-up animations, and responsive components.
 */

// ==========================================
// 1. COMPREHENSIVE TRANSLATIONS (AZ & EN)
// ==========================================
const translations = {
  az: {
    // Navigation
    navAbout: "Haqqımızda",
    navPrograms: "Proqramlar",
    navTimeline: "Yol Xəritəsi",
    navStartups: "Startaplar",
    navEvents: "Tədbirlər",
    navNews: "Xəbərlər",
    navMentors: "Mentorlar",
    navApply: "Müraciət Et",
    navSubBrand: "İnnovativ Biznes İnkubatoru",
    
    // Hero Section
    heroBadge: "İnnovasiya Eko-Sistemi — 2023-dən",
    heroTitlePrefix: "Universitet ideyalarını ",
    heroTitleGradient: "real startaplara ",
    heroTitleSuffix: "çeviririk",
    heroSubtext: "Azərbaycan Memarlıq və İnşaat Universitetinin tələbə, məzun və gənc tədqiqatçıları üçün inkubasiya, prototipləmə, mentorluq və toxum investisiyası platforması.",
    heroBtnStart: "İdeyaya Başla",
    heroBtnExplore: "Proqramları Kəşf Et",
    heroBtnStartups: "Startapları İzlə",
    
    // Hero Floating Cards
    cardIdeasTitle: "İdeyalar",
    cardIdeasDesc: "180+ Təqdim edilmiş layihə",
    cardStartupsTitle: "Startaplar",
    cardStartupsDesc: "40+ İnkubasiya məzunu",
    cardImpactTitle: "Dəstək",
    cardImpactDesc: "MVP Prototipləmə Dəstəyi",
    cardMentorsTitle: "Mentorlar",
    cardMentorsDesc: "50+ Sənaye eksperti",
    cardNetworkTitle: "Şəbəkə",
    cardNetworkDesc: "20+ Korporativ tərəfdaş",
    cardGrowthTitle: "İnkişaf",
    cardGrowthDesc: "94% Layihə uğur nisbəti",

    // About Section
    aboutBadge: "Haqqımızda",
    aboutTitle: "Gələcəyin İnnovasiya Mərkəzi",
    aboutSubtitle: "AzMİU İnnovativ Biznes İnkubatoru memarlıq, mühəndislik, inşaat texnologiyaları və rəqəmsal həllər üzrə lider universitet startap mərkəzidir.",
    aboutP1: "2023-cü ildən fəaliyyət göstərən AzMİU İBİ tələbə və tədqiqatçıların innovativ ideyalarını qlobal bazara çıxarıla bilən kommersiya məhsullarına çevirməyə xidmət edir.",
    aboutP2: "Biz müasir laboratoriya infrastrukturu, yüksək ixtisaslı sənaye mentorları və vençur fondları ilə birgə işləyərək PropTech, GreenTech, Smart City və BIM sahələrində startaplar yetişdiririk.",
    aboutBullet1Title: "Dərin İnkubasiya və Akselerasiya",
    aboutBullet1Desc: "12 həftəlik intensiv metodologiya, MVP hazırlığı və biznes modelinin formalaşdırılması.",
    aboutBullet2Title: "FabLab və 3D Prototipləmə",
    aboutBullet2Desc: "3D printerlər, CNC dəzgahları və VR/AR laboratoriyaları ilə real prototiplərin qurulması.",
    aboutBullet3Title: "Qlobal Əlaqələr və Toxum İnvestisiya",
    aboutBullet3Desc: "Yerli və beynəlxalq vençur fondları, biznes mələkləri və korporativ qrantlara çıxış.",
    
    // Counter Stats
    statStartups: "Startap",
    statMentors: "Mentor",
    statStudents: "Tələbə",
    statPartners: "Tərəfdaş",

    // Programs Section
    programsBadge: "Aktiv Proqramlar",
    programsTitle: "İnkubasiya və Təhsil Təşəbbüsləri",
    programsSubtitle: "İdeya mərhələsindən qlobal investisiyalara qədər hər səviyyə üçün ixtisaslaşmış akselerasiya proqramları.",
    filterAll: "Hamısı",
    filterEducation: "Təhsil",
    filterIncubation: "İnkubasiya",
    filterEvents: "Tədbirlər",
    pastProgramsBadge: "Arxiv",
    pastProgramsTitle: "Keçmiş proqramlar",
    pastProgramsSubtitle: "Aşağıdakı nümunələr şablon məlumatdır.",
    pastProgramsPeriod: "Keçirilmə dövrü",
    pastProgramsCompleted: "Başa çatıb",
    pastProgramsDetailsBtn: "Ətraflı",
    detailsAboutProgram: "Proqram haqqında",
    detailsAboutEvent: "Tədbir haqqında",
    detailsCloseBtn: "Bağla",
    detailsLocationLabel: "Məkan",
    detailsTimeLabel: "Saat",
    progDurationLabel: "Müddət:",
    progAudienceLabel: "Hədəf auditoriya:",
    progDeadlineLabel: "Son müraciət:",
    progApplyBtn: "Müraciət Et",
    progStatusOpen: "Qəbul Açıqdır",
    progStatusActive: "Aktivdir",
    progStatusSoon: "Tezliklə",

    // Timeline Section
    timelineBadge: "Addım-addım",
    timelineTitle: "Startapın İnkubasiya Səyahəti",
    timelineSubtitle: "Universitet auditoriyasından beynəlxalq bazara aparan 7 mərhələli ardıcıl inkişaf sistemi.",
    step1Phase: "Mərhələ 01",
    step1Title: "1. İdeya və Qeydiyyat",
    step1Desc: "Tələbə və tədqiqatçılar öz innovativ biznes ideyalarını portalımız vasitəsilə təqdim edirlər.",
    step2Phase: "Mərhələ 02",
    step2Title: "2. İlkin Qiymətləndirmə və Seçim",
    step2Desc: "Ekspert komitəsi bazar potensialı, texniki həyata keçirilmə və komanda motivasiyasını dəyərləndirir.",
    step3Phase: "Mərhələ 03",
    step3Title: "3. Komanda Formalaşması və MVP",
    step3Desc: "Biznes, dizayn və mühəndislik ixtisaslarından olan tələbələr vahid komanda təşkil edərək ilkin məhsulu (MVP) qururlar.",
    step4Phase: "Mərhələ 04",
    step4Title: "4. İntensiv Mentorluq və Təlimlər",
    step4Desc: "Həftəlik 1-on-1 mentor sessiyaları, biznes modeli kətanı, maliyyə planlaması və hüquqi dəstək.",
    step5Phase: "Mərhələ 05",
    step5Title: "5. Pilot Sınaqlar və Laboratoriya Validasiyası",
    step5Desc: "AzMİU FabLab və sənaye partnyorlarının obyektlərində real mühitdə məhsulun sınaqdan keçirilməsi.",
    step6Phase: "Mərhələ 06",
    step6Title: "6. Demo Day və Təqdimat",
    step6Desc: "Vençur investorlar, korporativ tərəfdaşlar və media qarşısında yekun layihə təqdimatı və pitçinq.",
    step7Phase: "Mərhələ 07",
    step7Title: "7. Məzuniyyət və Şirkətləşmə",
    step7Desc: "İnkubasiya proqramını uğurla bitirən layihələrin hüquqi qeydiyyatı, şirkətləşməsi və universitet dəstəyi ilə sənaye tərəfdaşlıqlarının qurulması.",
    step7Metric1Label: "MVP Prototipləmə",
    step7Metric1Value: "Dəstək və FabLab",
    step7Metric2Label: "Mentorluq & Məsləhət",
    step7Metric2Value: "Sənaye ekspertləri",
    step7Metric3Label: "Qrant & Şəbəkə",
    step7Metric3Value: "İnvestor ekosistemi",
    step7BtnApply: "İnkubasiyaya Müraciət",
    step7BtnStartups: "Məzun Startapları Gör",

    // Featured Startups
    startupsBadge: "İnkubasiya Məzunları",
    startupsTitle: "Seçilmiş Startaplarımız",
    startupsSubtitle: "İnkubatorumuzun divarları arasında doğulub real bazarda gəlir qazanan innovativ komandalar.",
    startupViewProfile: "Profili Göstər",
    startupMembersText: "komanda üzvü",
    modalFoundersLabel: "Təsisçilər",
    modalTechStackLabel: "Texnologiya Steki",
    modalStageLabel: "Mərhələ",
    modalTractionLabel: "Göstəricilər",
    modalVisitWebsite: "Vebsayta Keçid",

    // Events Section
    eventsBadge: "Təqvim",
    eventsTitle: "Qarşıdan Gələn Tədbirlər",
    eventsSubtitle: "Vorkşoplar, hakatonlar və investor görüşləri ilə innovasiya cəmiyyətimizə qoşulun.",
    eventRegisterBtn: "Qeydiyyat",
    eventDetailsBtn: "Ətraflı",
    eventAttendeesLabel: "qeydiyyatdan keçib",
    eventSpeakerLabel: "Spiker:",

    // News & Updates
    newsBadge: "Bloq və Elanlar",
    newsTitle: "Xəbərlər və Yeniliklər",
    newsSubtitle: "İnkubatorumuzun qrant uğurları, beynəlxalq əməkdaşlıqları və startap nailiyyətləri.",
    newsReadMore: "Ətraflı Oxu",
    newsFullArticleBtn: "Tam Məqalə",
    newsCloseLightbox: "Bağla",

    // Mentors Section
    mentorsBadge: "Ekspertlər Şəbəkəsi",
    mentorsTitle: "Bizim Mentorlarımız",
    mentorsSubtitle: "Sənayenin aparıcı rəhbərləri, təcrübəli sahibkarlar və texnologiya arxitektorları.",
    btnBecomeMentor: "Mentor Kimi Qoşul",
    filterMarketing: "Marketinq",
    filterIT: "IT və Mühəndislik",
    filterDesign: "Dizayn və BIM",
    filterBusiness: "Biznes",

    // Partners Section
    partnersBadge: "Eko-Sistem",
    partnersTitle: "Tərəfdaş və Əməkdaşlarımız",
    partnersSubtitle: "İnnovasiyaları birgə dəstəklədiyimiz aparıcı dövlət, təhsil və investisiya institutları.",

    // Footer
    footerDesc: "Azərbaycan Memarlıq və İnşaat Universiteti İnnovativ Biznes İnkubatoru — universitet intellektual potensialını rəqabətədavamlı bizneslərə çevirən innovasiya mərkəzidir.",
    footerAddress: "Ayna Sultanova küç. 11, Bakı, Azərbaycan, AZ1073",
    footerQuickLinks: "Sürətli Keçidlər",
    footerContact: "Əlaqə",
    footerRights: "© 2026 AzMİU İnnovativ Biznes İnkubatoru. Bütün hüquqlar qorunur.",
    footerBackToTop: "Yuxarı Qayıdın",
    backToTop: "Yuxarı Qayıdın",
    footerLinkAbout: "Haqqımızda",
    footerLinkPrograms: "Aktiv Proqramlar",
    footerLinkTimeline: "İnkubasiya Yol Xəritəsi",
    footerLinkStartups: "Uğurlu Startaplar",
    footerLinkEvents: "Qarşıdan Gələn Tədbirlər",
    footerLinkNews: "Xəbərlər və Yeniliklər",
    footerLinkMentors: "Mentor Şəbəkəsi",

    // Modal Controller & 4 Forms
    modalCloseBtn: "Ləğv et",
    btnSubmitting: "Göndərilir...",
    btnSuccessClose: "Tamamdır",

    // Form 1: Idea Submission
    formIdeaTitle: "İdeya Göndər — İnkubasiya Müraciəti",
    formIdeaDesc: "İnnovativ biznes ideyanızı inkubatorumuza təqdim edin. Komandamız 48 saat ərzində sizinlə əlaqə saxlayacaq.",
    fieldFullName: "Ad və Soyadınız *",
    fieldEmail: "E-poçt Ünvanınız *",
    fieldPhone: "Əlaqə Nömrəsi *",
    fieldStartupTitle: "Startap / İdeya Adı *",
    fieldStage: "Hazırkı Mərhələ *",
    stageIdea: "İdeya (Yalnız Konsept)",
    stageMVP: "MVP (İlkin Prototip Hazırdır)",
    stageSales: "Satış / İstifadəçi Mərhələsi",
    fieldDescription: "Qısa Təsvir və Problemin Həlli *",
    descPlaceholderIdea: "Layihənizin mahiyyəti, həll etdiyi problem və hədəf auditoriyası haqqında qısa yazın...",
    btnSubmitIdea: "İdeyanı Təqdim Et",
    successTitleIdea: "İdeyanız Uğurla Qeydə Alındı!",
    successDescIdea: "Təşəkkür edirik! Layihəniz ekspert komissiyasına yönləndirildi. Yaxın 48 saat ərzində elektron ünvanınız və ya telefonunuzla əlaqə saxlayacağıq.",

    // Form 2: Program Application
    formProgramTitle: "Proqrama Qoşul",
    formProgramDesc: "Seçilmiş akselerasiya və ya təhsil moduluna qoşulmaq üçün müraciət anketini tamamlayın.",
    fieldSelectedProgram: "Seçilmiş Proqram *",
    fieldUniversityFaculty: "Universitet / Fakültə / İxtisas *",
    univPlaceholder: "Məs: AzMİU, İnşaat Fakültəsi, 3-cü kurs",
    btnSubmitProgram: "Proqrama Müraciət Et",
    successTitleProgram: "Proqram Müraciətiniz Qəbul Edildi!",
    successDescProgram: "Qeydiyyatınız uğurla tamamlandı. Seçim mərhələsi və təlim cədvəli barədə məlumat e-poçt ünvanınıza göndəriləcəkdir.",

    // Form 3: Event Registration
    formEventTitle: "Tədbirə Qeydiyyat",
    formEventDesc: "Tədbirdə iştirakınızı təsdiqləmək üçün məlumatlarınızı daxil edin.",
    fieldEventTitle: "Tədbirin Adı *",
    fieldAttendanceFormat: "İştirak Formatı *",
    formatInPerson: "Əyani (AzMİU Kampusu)",
    formatOnline: "Onlayn (Canlı Yayım)",
    btnSubmitEvent: "Qeydiyyatı Təsdiqlə",
    successTitleEvent: "Tədbirə Qeydiyyatınız Təsdiqləndi!",
    successDescEvent: "Təbrik edirik! Giriş biletiniz və tədbir təqvimi təsdiq e-poçtunuza göndərildi. Sizi görməkdən məmnun olarıq!",

    // Form 4: Mentor Network
    formMentorTitle: "Mentor Kimi Qoşulun",
    formMentorDesc: "Təcrübənizi universitetin gənc startapçıları ilə bölüşün və gələcəyin texnologiyalarının qurulmasına dəstək olun.",
    fieldCompanyRole: "Şirkət / Təşkilat və Vəzifəniz *",
    companyRolePlaceholder: "Məs: Senior AI Engineer @ Tech Corp",
    fieldExpertise: "Əsas İxtisaslaşma Sahəniz *",
    expertiseIT: "IT və Mühəndislik",
    expertiseMarketing: "Marketinq və Böyümə",
    expertiseBusiness: "Biznes və İnvestisiya",
    expertiseDesign: "Dizayn, Memarlıq və BIM",
    expertiseFinance: "Maliyyə və Hüquq",
    fieldLinkedIn: "LinkedIn Profil Linkiniz *",
    fieldShortBio: "Qısa Bioqrafiya və Təcrübəniz *",
    bioPlaceholderMentor: "Tələbələrə hansı istiqamətlərdə mentorluq edə biləcəyiniz barədə qısa qeyd edin...",
    btnSubmitMentor: "Mentorluq Müraciətini Göndər",
    successTitleMentor: "Mentor Müraciətiniz Qəbul Olundu!",
    successDescMentor: "Ekspert şəbəkəmizə maraq göstərdiyiniz üçün təşəkkür edirik! İnkubator koordinatorumuz tezliklə sizinlə koordinasiya üçün əlaqə quracaq."
  },
  en: {
    // Navigation
    navAbout: "About Us",
    navPrograms: "Programs",
    navTimeline: "Roadmap",
    navStartups: "Startups",
    navEvents: "Events",
    navNews: "News",
    navMentors: "Mentors",
    navApply: "Apply Now",
    navSubBrand: "Innovative Business Incubator",
    
    // Hero Section
    heroBadge: "Innovation Ecosystem — Since 2023",
    heroTitlePrefix: "Transforming university ideas into ",
    heroTitleGradient: "real-world startups",
    heroTitleSuffix: "",
    heroSubtext: "An incubation, prototyping, mentorship, and seed investment hub for students, alumni, and young researchers of Azerbaijan University of Architecture and Construction.",
    heroBtnStart: "Start an Idea",
    heroBtnExplore: "Explore Programs",
    heroBtnStartups: "View Startups",

    // Hero Floating Cards
    cardIdeasTitle: "Ideas",
    cardIdeasDesc: "180+ Submitted projects",
    cardStartupsTitle: "Startups",
    cardStartupsDesc: "40+ Incubation graduates",
    cardImpactTitle: "Support",
    cardImpactDesc: "MVP Prototyping Support",
    cardMentorsTitle: "Mentors",
    cardMentorsDesc: "50+ Industry leaders",
    cardNetworkTitle: "Network",
    cardNetworkDesc: "20+ Corporate partners",
    cardGrowthTitle: "Growth",
    cardGrowthDesc: "94% Venture survival rate",

    // About Section
    aboutBadge: "About Us",
    aboutTitle: "The Innovation Hub of Tomorrow",
    aboutSubtitle: "AzMİU Innovative Business Incubator is a premier university startup hub specializing in architecture, civil engineering, PropTech, GreenTech, and digital solutions.",
    aboutP1: "Active since 2023, AzMİU IBI bridges university academic research with commercial market viability, guiding student founders from ideation to venture capital investment.",
    aboutP2: "Combining state-of-the-art laboratory infrastructure, veteran industry mentors, and VC partners, we nurture forward-thinking startups in PropTech, Smart Cities, GreenTech, and BIM.",
    aboutBullet1Title: "Intensive Incubation & Acceleration",
    aboutBullet1Desc: "12-week rigorous methodology covering customer discovery, MVP fabrication, and scalable business modeling.",
    aboutBullet2Title: "FabLab & 3D Prototyping",
    aboutBullet2Desc: "Equipped with advanced 3D printers, CNC cutting, and VR/AR immersive simulation labs.",
    aboutBullet3Title: "Global Network & Seed Capital",
    aboutBullet3Desc: "Direct access to top regional and international venture capital funds, angel syndicates, and grant programs.",
    
    // Counter Stats
    statStartups: "Startups",
    statMentors: "Mentors",
    statStudents: "Students",
    statPartners: "Partners",

    // Programs Section
    programsBadge: "Active Programs",
    programsTitle: "Incubation & Educational Initiatives",
    programsSubtitle: "Tailored acceleration tracks designed to elevate projects from early napkin sketches to venture capital investment.",
    filterAll: "All",
    filterEducation: "Education",
    filterIncubation: "Incubation",
    filterEvents: "Events",
    pastProgramsBadge: "Archive",
    pastProgramsTitle: "Past programs",
    pastProgramsSubtitle: "The examples below are placeholder content.",
    pastProgramsPeriod: "Program period",
    pastProgramsCompleted: "Completed",
    pastProgramsDetailsBtn: "Details",
    detailsAboutProgram: "About the program",
    detailsAboutEvent: "About the event",
    detailsCloseBtn: "Close",
    detailsLocationLabel: "Location",
    detailsTimeLabel: "Time",
    progDurationLabel: "Duration:",
    progAudienceLabel: "Target Audience:",
    progDeadlineLabel: "Deadline:",
    progApplyBtn: "Apply Now",
    progStatusOpen: "Applications Open",
    progStatusActive: "Active",
    progStatusSoon: "Coming Soon",

    // Timeline Section
    timelineBadge: "Step-by-Step",
    timelineTitle: "The Startup Incubation Journey",
    timelineSubtitle: "A 7-stage pathway connecting university classrooms to international market deployment.",
    step1Phase: "Milestone 01",
    step1Title: "1. Idea Submission & Screening",
    step1Desc: "Students and researchers register their breakthrough business concepts through our online portal.",
    step2Phase: "Milestone 02",
    step2Title: "2. Initial Assessment & Selection",
    step2Desc: "Our advisory committee analyzes market feasibility, technical defensibility, and founder drive.",
    step3Phase: "Milestone 03",
    step3Title: "3. Team Formation & MVP",
    step3Desc: "Cross-disciplinary teams from architecture, IT, and business unite to construct a rapid minimum viable product.",
    step4Phase: "Milestone 04",
    step4Title: "4. Intensive Mentorship & Workshops",
    step4Desc: "Weekly 1-on-1 sessions focusing on business model canvases, unit economics, IP protection, and financial modeling.",
    step5Phase: "Milestone 05",
    step5Title: "5. Pilot Testing & Lab Validation",
    step5Desc: "Real-world testing in the AzMİU FabLab and on-site facilities of our corporate industry partners.",
    step6Phase: "Milestone 06",
    step6Title: "6. Demo Day & Pitching",
    step6Desc: "Graduation pitch showcase in front of premier venture capitalists, angel investors, and tech media.",
    step7Phase: "Milestone 07",
    step7Title: "7. Graduation & Incorporation",
    step7Desc: "Formal incorporation, university IP protection, and industrial network building for graduating startup projects.",
    step7Metric1Label: "MVP Prototyping",
    step7Metric1Value: "Tech Lab Support",
    step7Metric2Label: "Mentorship",
    step7Metric2Value: "Industry Experts",
    step7Metric3Label: "Grants & Network",
    step7Metric3Value: "Investor Ecosystem",
    step7BtnApply: "Apply for Incubation",
    step7BtnStartups: "Explore Alumni Startups",

    // Featured Startups
    startupsBadge: "Incubator Alumni",
    startupsTitle: "Featured Startups",
    startupsSubtitle: "High-growth ventures born inside our university incubator, actively driving revenue in the market.",
    startupViewProfile: "View Profile",
    startupMembersText: "team members",
    modalFoundersLabel: "Founders",
    modalTechStackLabel: "Technology Stack",
    modalStageLabel: "Stage",
    modalTractionLabel: "Key Metrics",
    modalVisitWebsite: "Visit Website",

    // Events Section
    eventsBadge: "Calendar",
    eventsTitle: "Upcoming Events",
    eventsSubtitle: "Join our vibrant innovation community at workshops, hackathons, and investor pitch sessions.",
    eventRegisterBtn: "Register",
    eventDetailsBtn: "Details",
    eventAttendeesLabel: "registered",
    eventSpeakerLabel: "Speaker:",

    // News & Updates
    newsBadge: "Blog & Announcements",
    newsTitle: "News & Latest Updates",
    newsSubtitle: "Grant achievements, international partnerships, and breakthrough milestone stories.",
    newsReadMore: "Read Story",
    newsFullArticleBtn: "Full Article",
    newsCloseLightbox: "Close",

    // Mentors Section
    mentorsBadge: "Expert Network",
    mentorsTitle: "Our Mentors",
    mentorsSubtitle: "Top tier industry leaders, seasoned entrepreneurs, and technological pioneers.",
    btnBecomeMentor: "Join as a Mentor",
    filterMarketing: "Marketing",
    filterIT: "IT & Engineering",
    filterDesign: "Design & BIM",
    filterBusiness: "Business",

    // Partners Section
    partnersBadge: "Ecosystem",
    partnersTitle: "Partners & Collaborators",
    partnersSubtitle: "Leading governmental, academic, and venture institutions fostering innovation together.",

    // Footer
    footerDesc: "AzMİU Innovative Business Incubator — translating university intellectual property into high-impact, globally competitive businesses.",
    footerAddress: "11 Ayna Sultanova Street, Baku, Azerbaijan, AZ1073",
    footerQuickLinks: "Quick Links",
    footerContact: "Contact Us",
    footerRights: "© 2026 AzMİU Innovative Business Incubator. All rights reserved.",
    footerBackToTop: "Back to Top",
    backToTop: "Back to Top",
    footerLinkAbout: "About Us",
    footerLinkPrograms: "Active Programs",
    footerLinkTimeline: "Incubation Roadmap",
    footerLinkStartups: "Featured Startups",
    footerLinkEvents: "Upcoming Events",
    footerLinkNews: "News & Updates",
    footerLinkMentors: "Mentor Network",

    // Modal Controller & 4 Forms
    modalCloseBtn: "Cancel",
    btnSubmitting: "Submitting...",
    btnSuccessClose: "Done",

    // Form 1: Idea Submission
    formIdeaTitle: "Submit an Idea — Incubation Track",
    formIdeaDesc: "Pitch your innovative business concept to our university incubator committee. We will review and respond within 48 hours.",
    fieldFullName: "Full Name *",
    fieldEmail: "Email Address *",
    fieldPhone: "Phone Number *",
    fieldStartupTitle: "Startup / Idea Title *",
    fieldStage: "Current Stage *",
    stageIdea: "Idea (Concept Only)",
    stageMVP: "MVP (Prototype Ready)",
    stageSales: "Revenue / Traction Stage",
    fieldDescription: "Brief Description & Problem Solved *",
    descPlaceholderIdea: "Summarize your solution, target audience, and underlying competitive edge...",
    btnSubmitIdea: "Submit Pitch",
    successTitleIdea: "Idea Submitted Successfully!",
    successDescIdea: "Thank you for applying! Your venture has been submitted to the screening panel. We will reach out via email or phone within 48 hours.",

    // Form 2: Program Application
    formProgramTitle: "Apply for Program",
    formProgramDesc: "Complete your admission profile to enroll in our specialized acceleration cohort or educational bootcamp.",
    fieldSelectedProgram: "Selected Program *",
    fieldUniversityFaculty: "University / Faculty / Major *",
    univPlaceholder: "e.g., AUAC, Faculty of Construction, 3rd year",
    btnSubmitProgram: "Submit Application",
    successTitleProgram: "Application Received!",
    successDescProgram: "Your application is logged. Cohort selection dates and interview schedules will be dispatched to your inbox shortly.",

    // Form 3: Event Registration
    formEventTitle: "Event Registration",
    formEventDesc: "Reserve your seat for this upcoming workshop or guest keynote session.",
    fieldEventTitle: "Event Name *",
    fieldAttendanceFormat: "Attendance Format *",
    formatInPerson: "In-Person (AUAC Campus)",
    formatOnline: "Online (Live Stream)",
    btnSubmitEvent: "Confirm Seat",
    successTitleEvent: "Registration Confirmed!",
    successDescEvent: "Great! Your registration ticket and calendar pass have been delivered to your email. We look forward to seeing you!",

    // Form 4: Mentor Network
    formMentorTitle: "Join as a Mentor",
    formMentorDesc: "Share your professional expertise with ambitious student founders and shape the next generation of tech leaders.",
    fieldCompanyRole: "Company / Organization & Current Role *",
    companyRolePlaceholder: "e.g., Senior AI Engineer @ Tech Corp",
    fieldExpertise: "Primary Domain of Expertise *",
    expertiseIT: "IT & Engineering",
    expertiseMarketing: "Marketing & Growth",
    expertiseBusiness: "Business & Venture Capital",
    expertiseDesign: "Design, Architecture & BIM",
    expertiseFinance: "Finance & Corporate Law",
    fieldLinkedIn: "LinkedIn Profile URL *",
    fieldShortBio: "Short Bio & Mentorship Focus *",
    bioPlaceholderMentor: "Tell us briefly about the skills and guidance you wish to offer our cohort...",
    btnSubmitMentor: "Submit Mentor Application",
    successTitleMentor: "Mentor Application Received!",
    successDescMentor: "Thank you for supporting our university innovators! Our ecosystem director will reach out shortly to discuss onboarding."
  }
};

let currentLang = "az";

// ==========================================
// 2. DATASETS (PROGRAMS, STARTUPS, EVENTS, NEWS, MENTORS)
// ==========================================

const PROGRAMS_DATA = [
  {
    id: "prog-1",
    category: "incubation",
    status: "open",
    statusBadge: { az: "Qəbul Açıqdır", en: "Applications Open" },
    title: {
      az: "BIM & PropTech İnkubasiya 2026",
      en: "BIM & PropTech Incubation 2026"
    },
    description: {
      az: "Ağıllı tikinti, bina informasiya modelləşdirilməsi (BIM) və şəhərsalma texnologiyaları üzrə komandalar üçün 12 həftəlik sürətli inkişaf proqramı.",
      en: "A 12-week rigorous incubation program for teams developing smart construction, BIM workflows, and urban planning tech."
    },
    duration: { az: "12 Həftə", en: "12 Weeks" },
    audience: { az: "AzMİU Tələbə və Məzunları", en: "AUAC Students & Alumni" },
    deadline: { az: "25 Aprel 2026", en: "April 25, 2026" },
    icon: "building-2"
  },
  {
    id: "prog-2",
    category: "education",
    status: "active",
    statusBadge: { az: "Aktivdir", en: "Active" },
    title: {
      az: "Startap Akademiyası: 0-dan MVP-yə",
      en: "Startup Academy: Zero to MVP"
    },
    description: {
      az: "İdeyanın doğrulanması, biznes model kətanı, maliyyə planlaması və prototipləmə əsaslarını əhatə edən praktiki modul təlimləri.",
      en: "Hands-on modular workshops covering idea validation, business model canvas, financial projections, and rapid prototyping."
    },
    duration: { az: "6 Həftə", en: "6 Weeks" },
    audience: { az: "Bütün Fakültələrin Tələbələri", en: "All University Students" },
    deadline: { az: "Davam edir", en: "In Progress" },
    icon: "graduation-cap"
  },
  {
    id: "prog-3",
    category: "incubation",
    status: "open",
    statusBadge: { az: "Qəbul Açıqdır", en: "Applications Open" },
    title: {
      az: "GreenTech & Eko-Memarlıq Akseleratoru",
      en: "GreenTech & Eco-Architecture Accelerator"
    },
    description: {
      az: "Bərpa olunan enerji, karbon emissiyasının azaldılması və dayanıqlı tikinti materialları yaradan startaplar üçün toxum maliyyə dəstəkli proqram.",
      en: "Seed-funded accelerator for startups advancing renewable building systems, carbon reduction, and sustainable construction materials."
    },
    duration: { az: "16 Həftə", en: "16 Weeks" },
    audience: { az: "Tədqiqatçılar və Magistrlər", en: "Researchers & MSc Students" },
    deadline: { az: "10 May 2026", en: "May 10, 2026" },
    icon: "leaf"
  },
  {
    id: "prog-4",
    category: "events",
    status: "soon",
    statusBadge: { az: "Tezliklə", en: "Coming Soon" },
    title: {
      az: "Smart Baku Hakatonu 2026",
      en: "Smart Baku Hackathon 2026"
    },
    description: {
      az: "Ağıllı şəhər infrastrukturu, nəqliyyat optimizasiyası və sensor şəbəkələri mövzusunda 48 saatlıq intensiv komanda yarışması.",
      en: "A 48-hour continuous hackathon tackling urban mobility, intelligent infrastructure, and IoT municipal sensor grids."
    },
    duration: { az: "48 Saat", en: "48 Hours" },
    audience: { az: "Mühəndis, Dizayner və Proqramçılar", en: "Engineers, Designers & Coders" },
    deadline: { az: "1 İyun 2026", en: "June 1, 2026" },
    icon: "zap"
  }
];

const PAST_PROGRAMS_DATA = [
  {
    id: "past-program-1",
    title: { az: "Startap ideyası laboratoriyası", en: "Startup Idea Lab" },
    description: {
      az: "İdeyanın yoxlanması və ilk prototipin hazırlanması üzrə nümunə təlim proqramı.",
      en: "A sample training program for validating ideas and building a first prototype."
    },
    details: {
      az: "Bu nümunə proqram iştirakçılara problemin düzgün müəyyənləşdirilməsi, istifadəçi müsahibələrinin aparılması və ilkin biznes modelinin qurulması mövzularında praktiki bilik verib. Komandalar mentorlarla birlikdə ideyalarını sınaqdan keçirib, üç həftə ərzində işlək prototip hazırlayıb və yekunda münsiflər qarşısında təqdimat ediblər.",
      en: "This sample program gave participants practical guidance on problem discovery, user interviews, and early business-model design. Teams validated their ideas with mentors, built a working prototype over three weeks, and presented the results to a jury."
    },
    period: { az: "Mart – May 2025", en: "March – May 2025" },
    icon: "lightbulb"
  },
  {
    id: "past-program-2",
    title: { az: "Rəqəmsal şəhər həlləri", en: "Digital City Solutions" },
    description: {
      az: "Şəhər mühiti üçün rəqəmsal xidmətlərə həsr olunmuş şablon inkubasiya proqramı.",
      en: "A sample incubation program focused on digital services for urban life."
    },
    details: {
      az: "Şablon inkubasiya proqramında şəhər nəqliyyatı, kommunal xidmətlər və vətəndaş müraciətlərinin rəqəmsallaşdırılması üzrə layihələr hazırlanıb. İştirakçılar açıq şəhər məlumatları ilə işləyib, xidmət prototipləri qurub və həllərini bələdiyyə və sənaye nümayəndələrinə təqdim ediblər.",
      en: "This sample incubation program focused on digital solutions for mobility, public utilities, and citizen services. Participants worked with open urban data, produced service prototypes, and presented their solutions to municipal and industry representatives."
    },
    period: { az: "Sentyabr – Noyabr 2025", en: "September – November 2025" },
    icon: "building-2"
  },
  {
    id: "past-program-3",
    title: { az: "Yaşıl tikinti innovasiyaları", en: "Green Building Innovations" },
    description: {
      az: "Dayanıqlı materiallar və enerji səmərəliliyi mövzusunda nümunə akselerasiya proqramı.",
      en: "A sample accelerator for sustainable materials and energy efficiency."
    },
    details: {
      az: "Bu nümunə akselerasiya proqramı enerji səmərəli materiallar, ağıllı enerji idarəetməsi və tikinti tullantılarının təkrar istifadəsi mövzularını əhatə edib. Seçilmiş komandalar laboratoriya sınaqları, karbon izi hesablamaları və pilot tətbiq planı üzrə mütəxəssis dəstəyi alıblar.",
      en: "This sample accelerator covered energy-efficient materials, smart energy management, and construction-waste reuse. Selected teams received expert support for laboratory testing, carbon-footprint calculations, and pilot implementation planning."
    },
    period: { az: "Fevral – Aprel 2026", en: "February – April 2026" },
    icon: "leaf"
  }
];

const STARTUPS_DATA = [
  {
    id: "startup-1",
    name: "ArchAI",
    logoText: "AA",
    logoColor: "from-cyan-500 to-blue-600",
    tagline: {
      az: "Süni İntellekt əsaslı memarlıq layihələndirməsi",
      en: "Generative AI floorplan & architectural synthesis"
    },
    stage: { az: "Seed Mərhələsi", en: "Seed Stage" },
    members: 5,
    description: {
      az: "ArchAI memarlıq şirkətlərinə şəhərsalma normativlərinə 100% uyğunlaşdırılmış mərtəbə planlarını və 3D karkas modellərini saniyələr içində generasiya etmək imkanı verir.",
      en: "ArchAI empowers architectural firms to synthesize regulatory-compliant floor plans and structural 3D shells within seconds using fine-tuned spatial AI."
    },
    founders: [
      { name: "Orxan Quliyev", role: { az: "Həmtəsisçi & Baş Mühəndis", en: "Co-Founder & Lead Engineer" } },
      { name: "Leyla Məmmədova", role: { az: "Həmtəsisçi & Baş Memar", en: "Co-Founder & Chief Architect" } }
    ],
    techStack: ["PyTorch", "Three.js", "Revit API", "FastAPI", "React"],
    traction: {
      az: "12 aktiv korporativ sınaq lisenziyası və laboratoriya sınaqları",
      en: "12 active enterprise pilot contracts and lab validations"
    },
    website: "https://archai.example.com"
  },
  {
    id: "startup-2",
    name: "EcoConcrete",
    logoText: "EC",
    logoColor: "from-emerald-500 to-teal-600",
    tagline: {
      az: "Təkrar emal edilmiş kompozit sənaye betonu",
      en: "Ultra-low carbon geopolymetric recycled concrete"
    },
    stage: { az: "MVP & Pilot Sınaq", en: "MVP & Pilot Phase" },
    members: 4,
    description: {
      az: "Sənaye tullantılarından və vulkanik küllərdən istifadə edərək 65% daha aşağı karbon izinə və 30% daha yüksək seysmik dayanıqlığa malik yeni nəsil tikinti blokları istehsal edir.",
      en: "Manufactures next-generation modular building aggregates using industrial slag and volcanic pozzolans, lowering embodied carbon by 65% while increasing shear strength."
    },
    founders: [
      { name: "Kamran Əliyev", role: { az: "Materialşünas & Təsisçi", en: "Materials Scientist & Founder" } },
      { name: "Nigar Həsənli", role: { az: "Əməliyyat Direktoru", en: "COO & Civil Engineer" } }
    ],
    techStack: ["Geopolymer Chem", "ASTM C39 Standards", "IoT curing sensors"],
    traction: {
      az: "3 yerli tikinti holdinqi ilə pilot razılaşma",
      en: "3 formal LOIs with national civil contractors"
    },
    website: "https://ecoconcrete.example.com"
  },
  {
    id: "startup-3",
    name: "BuildSense IoT",
    logoText: "BS",
    logoColor: "from-violet-500 to-indigo-600",
    tagline: {
      az: "İnşaat obyektlərində simsiz təhlükəsizlik və telemetriya",
      en: "Autonomous wireless telemetry & jobsite safety"
    },
    stage: { az: "Böyümə Mərhələsi", en: "Growth Stage" },
    members: 6,
    description: {
      az: "İnşaat meydançalarında kranların, beton tökmə hərarətinin və işçi təhlükəsizliyinin real zaman rejimində LoRaWAN sensorları vasitəsilə vahid rəqəmsal xəritədə monitorinqi.",
      en: "Unified digital twin sensor network monitoring structural curing kinetics, crane clearance vectors, and personnel safety helmets via LoRaWAN."
    },
    founders: [
      { name: "Elvin Rzayev", role: { az: "IoT Sistem Arxitektoru", en: "Lead IoT Architect" } },
      { name: "Fərid Babayev", role: { az: "Məhsul Rəhbəri", en: "Head of Product" } }
    ],
    techStack: ["LoRaWAN", "Go Backend", "Next.js", "TimescaleDB", "Flutter"],
    traction: {
      az: "Aktiv pilot obyektlərində quraşdırılıb və real zaman rejimində işləyir",
      en: "Deployed at active pilot sites with real-time monitoring"
    },
    website: "https://buildsense.example.com"
  },
  {
    id: "startup-4",
    name: "SolarTile Baku",
    logoText: "ST",
    logoColor: "from-amber-500 to-orange-600",
    tagline: {
      az: "Dam örtükləri üçün estetik fotovoltaik keramik plitələr",
      en: "Building-integrated aesthetic solar roof tiles"
    },
    stage: { az: "İnkubasiya", en: "Incubation" },
    members: 3,
    description: {
      az: "Tarixi və müasir binaların dam estetikasını pozmadan günəş enerjisi toplayan monokristal fotovoltaik dam örtüklərinin layihələndirilməsi və istehsalı.",
      en: "Patented ceramic-integrated monocrystalline solar tiles engineered to preserve classical and modern architectural silhouettes while generating clean grid electricity."
    },
    founders: [
      { name: "Aysel Qasımova", role: { az: "Bərpa Olunan Enerji Mühəndisi", en: "Renewable Systems Lead" } },
      { name: "Tural Səfərov", role: { az: "Sənaye Dizayneri", en: "Industrial Designer" } }
    ],
    techStack: ["Perovskite-Silicon Cells", "SolidWorks", "ANSYS Thermal"],
    traction: {
      az: "AzMİU laboratoriyasında sınaqdan keçən 2 patent prototipi",
      en: "2 functional lab prototypes with pending utility patent"
    },
    website: "https://solartile.example.com"
  }
];

const EVENTS_DATA = [
  {
    id: "event-1",
    day: "28",
    month: { az: "SENT", en: "SEP" },
    title: {
      az: "PropTech & BIM İnnovasiya Sammiti 2026",
      en: "PropTech & BIM Innovation Summit 2026"
    },
    location: {
      az: "AzMİU Əsas Korpus, Konfrans Zalı",
      en: "AUAC Main Campus, Grand Conference Hall"
    },
    time: { az: "14:00 - 18:00", en: "2:00 PM - 6:00 PM" },
    attendees: "95/120",
    speaker: {
      az: "Dr. Elşad Qasımov (BIM eksperti, Foster+Partners məzunu)",
      en: "Dr. Elshad Gasimov (BIM Specialist, ex-Foster+Partners)"
    },
    description: {
      az: "Tikinti sektorunda rəqəmsal transformasiya, rəqəmsal əkizlər və startapların iri inşaat korporasiyaları ilə inteqrasiyası müzakirə olunacaq.",
      en: "Exploring digital twins, industrial BIM interoperability, and strategies for early-stage university startups to partner with commercial EPC contractors."
    },
    details: {
      az: "Sammitdə BIM əsaslı layihə idarəetməsi, rəqəmsal əkizlərin real obyektlərdə tətbiqi və universitet startaplarının iri tikinti şirkətləri ilə pilot əməkdaşlığı müzakirə olunacaq. Proqram ekspert çıxışları, real layihə nümunələri, sual-cavab sessiyası və şəbəkələşmə hissəsindən ibarətdir.",
      en: "The summit covers BIM-based project management, real-world digital-twin deployment, and pilot partnerships between university startups and major construction companies. The program includes expert talks, case studies, a Q&A session, and networking."
    }
  },
  {
    id: "event-2",
    day: "12",
    month: { az: "OKT", en: "OCT" },
    title: {
      az: "İdeyadan İnvestisiyaya: Vençur Sahibkarlığı Təlimi",
      en: "From Napkin to Term Sheet: VC Masterclass"
    },
    location: {
      az: "AzMİU İnkubator Coworking Mərkəzi",
      en: "AUAC Incubator Coworking Hub"
    },
    time: { az: "16:00 - 19:30", en: "4:00 PM - 7:30 PM" },
    attendees: "42/50",
    speaker: {
      az: "Rauf Həsənov (SABAH.fund İnvestisiya Direktoru)",
      en: "Rauf Hasanov (Investment Director, SABAH.fund)"
    },
    description: {
      az: "Startap qiymətləndirilməsi, cap table quruluşu, pitç-dek hazırlığı və investorlarla danışıqların incəlikləri barədə intensiv seminar.",
      en: "A comprehensive deep dive into early startup valuations, cap table hygiene, investor pitch deck storytelling, and term-sheet negotiation tactics."
    },
    details: {
      az: "İntensiv təlimdə startapın ilkin qiymətləndirilməsi, təsisçi paylarının düzgün bölünməsi, investora təqdimatın strukturu və danışıqlar zamanı əsas şərtlər izah ediləcək. İştirakçılar nümunə cap table quracaq və öz pitçlərini ekspert rəyi ilə təkmilləşdirəcəklər.",
      en: "This intensive session explains early-stage valuation, founder equity allocation, investor-pitch structure, and key negotiation terms. Participants will build a sample cap table and improve their own pitch with expert feedback."
    }
  },
  {
    id: "event-3",
    day: "24",
    month: { az: "OKT", en: "OCT" },
    title: {
      az: "FabLab 3D Prototipləmə Praktik Vorkşopu",
      en: "Hands-on 3D Rapid Prototyping Workshop"
    },
    location: {
      az: "AzMİU İnnovasiya Mərkəzi, FabLab",
      en: "AUAC Innovation Center, FabLab"
    },
    time: { az: "11:00 - 15:00", en: "11:00 AM - 3:00 PM" },
    attendees: "28/30",
    speaker: {
      az: "Samir Mirzəyev (FabLab Mühəndisi)",
      en: "Samir Mirzayev (Lead FabLab Engineer)"
    },
    description: {
      az: "Tələbələr öz 3D CAD modellərini sənaye printerlərində və lazer kəsicilərdə real fiziki maketlərə çevirməyi praktiki öyrənəcəklər.",
      en: "Participants learn hands-on slice modeling, SLA/FDM 3D printing calibration, and laser cutting to assemble tangible working physical prototypes."
    },
    details: {
      az: "Praktik vorkşop zamanı iştirakçılar CAD modelinin istehsala hazırlanması, material seçimi, 3D printer parametrləri və lazer kəsim təhlükəsizliyi ilə tanış olacaqlar. Hər iştirakçı kiçik bir detal hazırlayacaq, çap prosesini izləyəcək və yekun maketin yığılmasında iştirak edəcək.",
      en: "During this hands-on workshop, participants learn production-ready CAD preparation, material selection, printer settings, and laser-cutting safety. Each participant will prepare a small component, monitor the print, and help assemble a final prototype."
    }
  }
];

const NEWS_DATA = [
  {
    id: "news-1",
    category: { az: "Qrant & Qələbə", en: "Grant & Award" },
    date: { az: "18 Mart 2026", en: "March 18, 2026" },
    title: {
      az: "AzMİU İBİ startapı innovasiya müsabiqəsində qalib gəldi",
      en: "AUAC Incubator startup triumphs at national innovation challenge"
    },
    summary: {
      az: "İnkubatorumuzun yetirməsi olan 'EcoConcrete' komandası müsabiqədə uğur qazanaraq prototipləmə və laboratoriya dəstəyi əldə etdi.",
      en: "Our resident team 'EcoConcrete' triumphed at the national challenge, securing advanced prototyping backing and lab access."
    },
    fullText: {
      az: "Azərbaycan Memarlıq və İnşaat Universiteti İnnovativ Biznes İnkubatorunun yetirməsi olan 'EcoConcrete' startapı İnnovasiya və Rəqəmsal İnkişaf Agentliyinin (IRIA) təşkil etdiyi illik milli innovasiya müsabiqəsində qalib elan edildi. Layihə sənaye tullantılarından ultra-aşağı karbonlu geopolimer kompozit beton istehsalını nəzərdə tutur. Göstərilən texniki dəstək hesabına komanda AzMİU FabLab bazasında sınaq xəttini quracaq və pilot bloklarını yerli inşaat şirkətlərinə sınaq üçün təqdim edəcəkdir.",
      en: "EcoConcrete, an incubated startup originating from the labs of the Azerbaijan University of Architecture and Construction, has been officially awarded top honors in the annual innovation challenge organized by the Innovation and Digital Development Agency (IRIA). The project manufactures ultra-low carbon geopolymetric construction materials from recycled industrial waste. With specialized lab and prototyping backing, the team will scale pilot blocks inside the AUAC FabLab."
    },
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "news-2",
    category: { az: "Beynəlxalq Tərəfdaşlıq", en: "Global Alliance" },
    date: { az: "02 Mart 2026", en: "March 2, 2026" },
    title: {
      az: "Avropanın aparıcı texniki universitetləri ilə yeni mübadilə proqramı",
      en: "New venture exchange pact signed with top European technical hubs"
    },
    summary: {
      az: "AzMİU İBİ startapları Milan Politexnik Universiteti və Delft Texniki Universiteti inkubatorlarında təcrübə keçmək imkanı qazanırlar.",
      en: "AUAC incubator founders will now participate in bilateral acceleration exchanges with Politecnico di Milano and TU Delft venture incubators."
    },
    fullText: {
      az: "Azərbaycan Memarlıq və İnşaat Universiteti İnnovativ Biznes İnkubatoru Avropanın qabaqcıl arxitektura və mühəndislik məktəbləri ilə strateji memorandum imzalayıb. Razılaşmaya əsasən hər il AzMİU İBİ-nin ən uğurlu 3 startap komandası 4 həftə müddətində Milan və Delft şəhərlərindəki akselerasiya mərkəzlərində Avropa vençur fondları ilə pitçinq görüşlərinə qatılacaq, həmçinin beynəlxalq sertifikatlaşdırma dəstəyi alacaqlar.",
      en: "AUAC Innovative Business Incubator has formalized a tripartite venture partnership with the entrepreneurship ecosystems of Politecnico di Milano and TU Delft. The flagship program entitles the top 3 cohort startups annually to take residency in European innovation labs, pitch directly to continental green infrastructure venture funds, and accelerate EU-standard CE mark certifications."
    },
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "news-3",
    category: { az: "İnkubator İnfrastrukturu", en: "Campus Milestone" },
    date: { az: "15 Fevral 2026", en: "February 15, 2026" },
    title: {
      az: "Yeni Nəsil 'BIM & VR Simulyasiya Mərkəzi' istifadəyə verildi",
      en: "State-of-the-art 'BIM & VR Simulation Laboratory' inaugurated"
    },
    summary: {
      az: "Tələbələr və startapçılar üçün ən son texnologiyalı virtual reallıq eynəkləri və güclü qrafik iş stansiyaları ilə təchiz olunmuş laboratoriya açıldı.",
      en: "A modern co-working and simulation facility outfitted with enterprise VR headgear and high-throughput rendering nodes is now fully open."
    },
    fullText: {
      az: "AzMİU kampusunda fəaliyyət göstərən İnkubatorun nəzdində yeni 'BIM və VR Simulyasiya Mərkəzi' qapılarını innovativ gənclərin üzünə açdı. Mərkəz memarlıq layihələrini tikinti başlamazdan əvvəl 1:1 miqyasda virtual təcrübədən keçirməyə, akustik və istilik izolyasiyası simulyasiyaları aparmağa imkan verən qabaqcıl sensor avadanlıqları ilə təmin olunmuşdur.",
      en: "The AzMİU incubator has officially cut the ribbon on its advanced BIM & VR Simulation Laboratory. Built to serve incubated teams and researchers, the facility features dedicated GPU-accelerated computing rigs and enterprise spatial headsets, allowing founders to walk clients through 1:1 scale immersive digital architecture and test thermal simulations in real time."
    },
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"
  }
];

const MENTORS_DATA = [
  {
    id: "mentor-1",
    name: "Teymur Məmmədov",
    role: { az: "Baş Texnoloji Direktor, PropTech Labs", en: "Chief Technology Officer, PropTech Labs" },
    category: "it",
    skills: ["AI Systems", "Cloud Arch", "Python", "Revit API"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" }
  },
  {
    id: "mentor-2",
    name: "Aynur Hüseynova",
    role: { az: "Rəqəmsal Marketinq və Böyümə Direktoru", en: "VP of Growth & Digital Marketing" },
    category: "marketing",
    skills: ["Growth Hacking", "B2B SaaS", "Brand Strategy", "GTM"],
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" }
  },
  {
    id: "mentor-3",
    name: "Murad Səlimov",
    role: { az: "Aparıcı Şəhərsalma Arxitektoru", en: "Principal Urban Architect & BIM Lead" },
    category: "design",
    skills: ["BIM Level 3", "Computational Design", "Rhino/Grasshopper", "UI/UX"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" }
  },
  {
    id: "mentor-4",
    name: "Rəşad Vəliyev",
    role: { az: "Vençur İnvestoru & Sahibkar", en: "Venture Partner & Angel Investor" },
    category: "business",
    skills: ["Fundraising", "Cap Table", "Financial Modeling", "Corporate Strategy"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    socials: { linkedin: "https://linkedin.com", github: "https://github.com" }
  }
];

// ==========================================
// 3. LANGUAGE SWITCHING ENGINE
// ==========================================

function updateLanguage(newLang) {
  currentLang = newLang;
  document.documentElement.lang = newLang;

  // Update navbar language button text/active state
  const langToggleBtn = document.getElementById("lang-toggle-btn");
  if (langToggleBtn) {
    langToggleBtn.setAttribute("data-current-lang", newLang);
    const azSpan = langToggleBtn.querySelector(".lang-az");
    const enSpan = langToggleBtn.querySelector(".lang-en");
    if (azSpan && enSpan) {
      if (newLang === "az") {
        azSpan.className = "lang-az font-bold text-blue-700";
        enSpan.className = "lang-en text-slate-500";
      } else {
        azSpan.className = "lang-az text-slate-500";
        enSpan.className = "lang-en font-bold text-blue-700";
      }
    }
  }

  // Update all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[newLang] && translations[newLang][key] !== undefined) {
      el.textContent = translations[newLang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[newLang] && translations[newLang][key] !== undefined) {
      el.setAttribute("placeholder", translations[newLang][key]);
    }
  });

  // Re-render dynamic components
  renderPrograms(currentProgramsFilter);
  renderPastPrograms();
  renderStartups();
  renderEvents();
  renderNews();
  renderMentors(currentMentorsFilter);

  // If modal is currently open, refresh active form text
  if (currentActiveModalType) {
    openModal(currentActiveModalType, currentActiveModalData, true);
  }

  if (currentDetailsContext) {
    openDetailsModal(currentDetailsContext.type, currentDetailsContext.id);
  }

  // Refresh Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

// ==========================================
// 4. ANIMATED STATS COUNTER
// ==========================================

let hasAnimatedStats = false;

function initStatsCounter() {
  const statsSection = document.getElementById("stats-section");
  if (!statsSection) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          animateNumbers();
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(statsSection);
}

function animateNumbers() {
  const counters = document.querySelectorAll(".stat-counter");
  const duration = 1800; // ms
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"), 10);
    const suffix = counter.getAttribute("data-suffix") || "+";
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * (1 - Math.pow(1 - progress, 3)));

      counter.textContent = current + suffix;

      if (frame >= totalFrames) {
        counter.textContent = target + suffix;
        clearInterval(timer);
      }
    }, frameRate);
  });
}

// ==========================================
// 5. SCROLL ANIMATIONS (.animate-on-scroll)
// ==========================================

function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// ==========================================
// 6. ROADMAP TIMELINE SCROLL OBSERVER
// ==========================================

function initTimelineScrollObserver() {
  const timelineCards = document.querySelectorAll(".timeline-card");
  if (!timelineCards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const dotId = entry.target.getAttribute("data-dot-id");
        const dot = document.getElementById(dotId);

        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
          if (dot) dot.classList.add("is-active");
        } else {
          entry.target.classList.remove("is-active");
          if (dot) dot.classList.remove("is-active");
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "-10% 0px -15% 0px"
    }
  );

  timelineCards.forEach((card) => observer.observe(card));
}

function alignTimelineConnector() {
  const connector = document.getElementById("timeline-connector");
  const finalDot = document.getElementById("dot-step-7");
  const timeline = connector?.parentElement;
  if (!timeline || !connector || !finalDot) return;

  const connectorTop = connector.getBoundingClientRect().top;
  const dot = finalDot.getBoundingClientRect();
  connector.style.height = `${Math.max(0, dot.top - connectorTop + dot.height / 2)}px`;
}

function keepTimelineConnectorAligned() {
  const timeline = document.getElementById("timeline-connector")?.parentElement;
  if (!timeline) return;

  const update = () => window.requestAnimationFrame(alignTimelineConnector);
  update();
  window.addEventListener("load", update, { once: true });
  document.fonts?.ready.then(update);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(update);
    observer.observe(timeline);
  }
}

// ==========================================
// 7. PROGRAMS FILTERING & RENDERING
// ==========================================

let currentProgramsFilter = "all";

function renderPrograms(filter = "all") {
  currentProgramsFilter = filter;
  const container = document.getElementById("programs-grid");
  if (!container) return;

  const filtered = filter === "all"
    ? PROGRAMS_DATA
    : PROGRAMS_DATA.filter((p) => p.category === filter);

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500">Bu kateqoriyada hələlik proqram yoxdur.</div>`;
    return;
  }

  filtered.forEach((prog) => {
    const card = document.createElement("div");
    card.className = "glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all";

    let badgeClass = "bg-cyan-500/10 text-blue-700 border-cyan-500/30";
    if (prog.status === "active") badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
    if (prog.status === "soon") badgeClass = "bg-amber-500/10 text-amber-700 border-amber-500/30";

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}">
            ${prog.statusBadge[currentLang]}
          </span>
          <div class="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-700">
            <i data-lucide="${prog.icon}" class="w-5 h-5"></i>
          </div>
        </div>

        <h3 class="text-xl font-bold text-slate-900 mb-2 leading-snug">
          ${prog.title[currentLang]}
        </h3>

        <p class="text-sm text-slate-600 leading-relaxed mb-6">
          ${prog.description[currentLang]}
        </p>
      </div>

      <div>
        <div class="space-y-2 pt-4 border-t border-slate-200 text-xs text-slate-500 mb-6">
          <div class="flex items-center justify-between">
            <span>${translations[currentLang].progDurationLabel}</span>
            <span class="font-semibold text-slate-700">${prog.duration[currentLang]}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>${translations[currentLang].progAudienceLabel}</span>
            <span class="font-semibold text-slate-700">${prog.audience[currentLang]}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>${translations[currentLang].progDeadlineLabel}</span>
            <span class="font-semibold text-blue-700">${prog.deadline[currentLang]}</span>
          </div>
        </div>

        <button 
          onclick="openModal('program', '${prog.id}')"
          class="btn-primary w-full py-2.5 px-4 text-sm"
        >
          <span>${translations[currentLang].progApplyBtn}</span>
          <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Update tabs visual state
  document.querySelectorAll(".prog-filter-btn").forEach((btn) => {
    const tabFilter = btn.getAttribute("data-filter");
    if (tabFilter === filter) {
      btn.className = "prog-filter-btn px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-violet-600 to-cyan-500 shadow-md shadow-cyan-500/20";
    } else {
      btn.className = "prog-filter-btn px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 transition-all";
    }
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function renderPastPrograms() {
  const container = document.getElementById("past-programs-grid");
  if (!container) return;

  const t = translations[currentLang];
  container.innerHTML = PAST_PROGRAMS_DATA.map((program) => `
    <article class="past-program-card rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
      <div class="mb-5 flex items-center justify-between gap-3">
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">${t.pastProgramsCompleted}</span>
        <i data-lucide="${program.icon}" class="h-5 w-5 text-blue-700" aria-hidden="true"></i>
      </div>
      <h4 class="mb-2 text-lg font-semibold text-slate-950">${program.title[currentLang]}</h4>
      <p class="mb-6 text-sm leading-relaxed text-slate-600 flex-1">${program.description[currentLang]}</p>
      <div class="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-slate-500">${t.pastProgramsPeriod}: <span class="font-semibold text-slate-700">${program.period[currentLang]}</span></p>
        <button type="button" onclick="openDetailsModal('program', '${program.id}')" class="btn-secondary px-4 py-2 text-xs">
          ${t.pastProgramsDetailsBtn}
        </button>
      </div>
    </article>
  `).join("");

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

let currentDetailsContext = null;

const PAGE_OVERLAY_IDS = [
  "universal-modal",
  "details-modal",
  "startup-modal",
  "news-lightbox",
];

let lockedPageScrollY = 0;

function lockPageScroll() {
  if (document.body.dataset.scrollLocked === "true") return;

  lockedPageScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add("modal-open");
  document.body.classList.add("modal-open");
  document.body.dataset.scrollLocked = "true";
  document.body.style.position = "fixed";
  document.body.style.top = `-${lockedPageScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockPageScrollIfNoOverlay() {
  const hasOpenOverlay = PAGE_OVERLAY_IDS.some((id) => {
    const overlay = document.getElementById(id);
    return overlay && !overlay.classList.contains("hidden");
  });

  if (hasOpenOverlay || document.body.dataset.scrollLocked !== "true") return;

  document.documentElement.classList.remove("modal-open");
  document.body.classList.remove("modal-open");
  delete document.body.dataset.scrollLocked;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, lockedPageScrollY);
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
}

function openDetailsModal(type, id) {
  const modal = document.getElementById("details-modal");
  const content = document.getElementById("details-modal-content");
  if (!modal || !content) return;

  const t = translations[currentLang];
  const isProgram = type === "program";
  const item = isProgram
    ? PAST_PROGRAMS_DATA.find((program) => program.id === id)
    : EVENTS_DATA.find((event) => event.id === id);
  if (!item) return;

  currentDetailsContext = { type, id };

  const metaHtml = isProgram
    ? `
      <div class="details-meta-row">
        <i data-lucide="calendar-range" class="w-4 h-4 text-blue-700 shrink-0"></i>
        <span>${t.pastProgramsPeriod}: <strong>${item.period[currentLang]}</strong></span>
      </div>`
    : `
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="details-meta-row"><i data-lucide="calendar-days" class="w-4 h-4 text-blue-700 shrink-0"></i><span>${item.day} ${item.month[currentLang]} 2026</span></div>
        <div class="details-meta-row"><i data-lucide="clock" class="w-4 h-4 text-blue-700 shrink-0"></i><span>${t.detailsTimeLabel}: <strong>${item.time[currentLang]}</strong></span></div>
        <div class="details-meta-row sm:col-span-2"><i data-lucide="map-pin" class="w-4 h-4 text-blue-700 shrink-0"></i><span>${t.detailsLocationLabel}: <strong>${item.location[currentLang]}</strong></span></div>
        <div class="details-meta-row sm:col-span-2"><i data-lucide="user-check" class="w-4 h-4 text-emerald-700 shrink-0"></i><span>${t.eventSpeakerLabel} <strong>${item.speaker[currentLang]}</strong></span></div>
      </div>`;

  content.innerHTML = `
    <button type="button" onclick="closeDetailsModal()" class="absolute top-5 right-5 p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors" aria-label="${t.detailsCloseBtn}">
      <i data-lucide="x" class="w-5 h-5"></i>
    </button>
    <div class="pr-11">
      <span class="inline-flex items-center rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
        ${isProgram ? t.pastProgramsCompleted : t.eventsBadge}
      </span>
      <h2 id="details-modal-title" class="text-2xl sm:text-3xl font-bold text-slate-950 leading-tight">${item.title[currentLang]}</h2>
    </div>
    <div class="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
      ${metaHtml}
    </div>
    <div class="mt-6">
      <h3 class="text-sm font-bold text-slate-950 mb-2">${isProgram ? t.detailsAboutProgram : t.detailsAboutEvent}</h3>
      <p class="text-sm sm:text-base leading-7 text-slate-600">${item.details[currentLang]}</p>
    </div>
    <div class="mt-7 flex justify-end">
      <button type="button" onclick="closeDetailsModal()" class="btn-primary px-6 py-2.5 text-sm">${t.detailsCloseBtn}</button>
    </div>
  `;

  modal.classList.remove("hidden");
  lockPageScroll();
  requestAnimationFrame(() => modal.classList.remove("opacity-0"));
  window.lucide?.createIcons?.();
}

function closeDetailsModal() {
  const modal = document.getElementById("details-modal");
  if (!modal) return;
  modal.classList.add("opacity-0");
  currentDetailsContext = null;
  setTimeout(() => {
    modal.classList.add("hidden");
    unlockPageScrollIfNoOverlay();
  }, 250);
}

// ==========================================
// 8. FEATURED STARTUPS & PROFILE MODAL
// ==========================================

function renderStartups() {
  const container = document.getElementById("startups-grid");
  if (!container) return;

  container.innerHTML = "";

  STARTUPS_DATA.forEach((st) => {
    const card = document.createElement("div");
    card.className = "glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all";

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr ${st.logoColor} flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg">
            ${st.logoText}
          </div>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-slate-200">
            ${st.stage[currentLang]}
          </span>
        </div>

        <h3 class="text-xl font-bold text-slate-900 mb-1">
          ${st.name}
        </h3>

        <p class="text-sm font-medium text-blue-700/90 mb-3">
          ${st.tagline[currentLang]}
        </p>

        <p class="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">
          ${st.description[currentLang]}
        </p>
      </div>

      <div>
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-5 pt-3 border-t border-slate-200">
          <i data-lucide="users" class="w-4 h-4 text-blue-700"></i>
          <span>${st.members} ${translations[currentLang].startupMembersText}</span>
        </div>

        <button 
          onclick="openStartupModal('${st.id}')"
          class="btn-secondary w-full py-2.5 px-4 text-sm"
        >
          <span>${translations[currentLang].startupViewProfile}</span>
          <i data-lucide="external-link" class="w-4 h-4 ml-2"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function openStartupModal(id) {
  const startup = STARTUPS_DATA.find((s) => s.id === id);
  if (!startup) return;

  const modal = document.getElementById("startup-modal");
  const modalContent = document.getElementById("startup-modal-content");
  if (!modal || !modalContent) return;

  const foundersHtml = startup.founders
    .map(
      (f) => `
      <div class="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
        <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-blue-700 font-bold text-sm">
          ${f.name.charAt(0)}
        </div>
        <div>
          <div class="text-sm font-semibold text-slate-900">${f.name}</div>
          <div class="text-xs text-slate-500">${f.role[currentLang]}</div>
        </div>
      </div>`
    )
    .join("");

  const techStackHtml = startup.techStack
    .map(
      (t) => `
      <span class="px-2.5 py-1 rounded-lg text-xs font-mono bg-white text-slate-600 border border-slate-200">
        ${t}
      </span>`
    )
    .join("");

  modalContent.innerHTML = `
    <div class="flex items-start justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${startup.logoColor} flex items-center justify-center font-bold text-slate-950 text-xl shadow-xl">
          ${startup.logoText}
        </div>
        <div>
          <h2 class="text-2xl font-bold text-slate-900 leading-tight">${startup.name}</h2>
          <span class="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-blue-700 border border-cyan-500/30">
            ${startup.stage[currentLang]}
          </span>
        </div>
      </div>
      <button 
        onclick="closeStartupModal()"
        class="text-slate-500 hover:text-slate-950 p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
      >
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="space-y-6">
      <div>
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Haqqında</h4>
        <p class="text-sm text-slate-700 leading-relaxed">${startup.description[currentLang]}</p>
      </div>

      <div>
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          ${translations[currentLang].modalFoundersLabel}
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${foundersHtml}
        </div>
      </div>

      <div>
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          ${translations[currentLang].modalTechStackLabel}
        </h4>
        <div class="flex flex-wrap gap-2">
          ${techStackHtml}
        </div>
      </div>

      <div class="p-4 rounded-xl bg-white border border-slate-200">
        <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          ${translations[currentLang].modalTractionLabel}
        </h4>
        <p class="text-sm font-medium text-emerald-700">${startup.traction[currentLang]}</p>
      </div>

      <div class="pt-2 flex items-center justify-end gap-3">
        <button 
          onclick="closeStartupModal()"
          class="btn-secondary px-5 py-2.5 text-sm"
        >
          ${translations[currentLang].modalCloseBtn}
        </button>
        <a 
          href="${startup.website}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn-primary px-5 py-2.5 text-sm"
        >
          <span>${translations[currentLang].modalVisitWebsite}</span>
          <i data-lucide="arrow-up-right" class="w-4 h-4 ml-1.5"></i>
        </a>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  lockPageScroll();
  setTimeout(() => {
    modal.classList.remove("opacity-0");
  }, 10);

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function closeStartupModal() {
  const modal = document.getElementById("startup-modal");
  if (!modal) return;
  modal.classList.add("opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    unlockPageScrollIfNoOverlay();
  }, 250);
}

// ==========================================
// 9. UPCOMING EVENTS
// ==========================================

function renderEvents() {
  const container = document.getElementById("events-grid");
  if (!container) return;

  container.innerHTML = "";

  EVENTS_DATA.forEach((ev) => {
    const card = document.createElement("div");
    card.className = "glass-panel glass-panel-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all";

    card.innerHTML = `
      <div>
        <div class="flex items-start gap-4 mb-4">
          <div class="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 text-blue-700 shrink-0">
            <span class="text-xl font-extrabold leading-none">${ev.day}</span>
            <span class="text-[10px] font-bold tracking-wider uppercase mt-0.5">${ev.month[currentLang]}</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 leading-snug">
              ${ev.title[currentLang]}
            </h3>
            <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-700"></i>
              <span>${ev.time[currentLang]}</span>
            </div>
          </div>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed mb-4">
          ${ev.description[currentLang]}
        </p>

        <div class="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-200 mb-6">
          <div class="flex items-center gap-2">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-700 shrink-0"></i>
            <span class="truncate">${ev.location[currentLang]}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="user-check" class="w-3.5 h-3.5 text-emerald-700 shrink-0"></i>
            <span class="truncate">${ev.speaker[currentLang]}</span>
          </div>
          <div class="flex items-center gap-2">
            <i data-lucide="users" class="w-3.5 h-3.5 text-amber-700 shrink-0"></i>
            <span>${ev.attendees} ${translations[currentLang].eventAttendeesLabel}</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick="openModal('event', '${ev.id}')"
          class="btn-primary flex-1 py-2.5 px-4 text-sm"
        >
          ${translations[currentLang].eventRegisterBtn}
        </button>
        <button 
          onclick="openDetailsModal('event', '${ev.id}')"
          class="btn-secondary py-2.5 px-4 text-sm"
        >
          ${translations[currentLang].eventDetailsBtn}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

// ==========================================
// 10. NEWS & FULLSCREEN GLASS LIGHTBOX
// ==========================================

function renderNews() {
  const container = document.getElementById("news-grid");
  if (!container) return;

  container.innerHTML = "";

  NEWS_DATA.forEach((item) => {
    const card = document.createElement("div");
    card.className = "glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all";
    card.onclick = () => openNewsLightbox(item.id);

    card.innerHTML = `
      <div>
        <div class="relative h-48 w-full overflow-hidden bg-white">
          <img 
            src="${item.image}" 
            alt="${item.title[currentLang]}" 
            class="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <!-- Linear Dark Gradient Mask for Crisp Text Contrast -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none"></div>
          
          <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white text-blue-700 border border-slate-200 shadow-lg">
            ${item.category[currentLang]}
          </span>
          <span class="absolute bottom-3 left-3 text-xs text-slate-600 font-medium">
            ${item.date[currentLang]}
          </span>
        </div>

        <div class="p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-2 leading-snug hover:text-blue-700 transition-colors">
            ${item.title[currentLang]}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed line-clamp-3">
            ${item.summary[currentLang]}
          </p>
        </div>
      </div>

      <div class="px-6 pb-6 pt-2">
        <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-700 transition-colors">
          <span>${translations[currentLang].newsReadMore}</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function openNewsLightbox(id) {
  const item = NEWS_DATA.find((n) => n.id === id);
  if (!item) return;

  const lightbox = document.getElementById("news-lightbox");
  const content = document.getElementById("news-lightbox-content");
  if (!lightbox || !content) return;

  content.innerHTML = `
    <div class="relative w-full h-64 sm:h-80 overflow-hidden bg-white">
      <img 
        src="${item.image}" 
        alt="${item.title[currentLang]}" 
        class="w-full h-full object-cover object-center" 
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      
      <button 
        onclick="closeNewsLightbox()"
        class="absolute top-4 right-4 z-10 text-slate-700 hover:text-slate-950 p-2.5 rounded-full backdrop-blur-xl bg-white border border-slate-200 shadow-xl transition-all cursor-pointer"
        aria-label="Close Lightbox"
      >
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="absolute bottom-4 left-6 right-6">
        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-cyan-500/20 text-blue-700 border border-cyan-500/30 mb-2">
          ${item.category[currentLang]}
        </span>
        <div class="text-xs text-slate-600 mb-1 font-medium">${item.date[currentLang]}</div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-950 leading-tight">
          ${item.title[currentLang]}
        </h2>
      </div>
    </div>

    <div class="p-6 sm:p-8 space-y-4">
      <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
        ${item.fullText[currentLang]}
      </p>

      <div class="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span class="text-xs text-slate-500">AzMİU İnnovativ Biznes İnkubatoru Mətbuat Xidməti</span>
        <button 
          onclick="closeNewsLightbox()"
          class="btn-primary px-5 py-2 text-sm"
        >
          ${translations[currentLang].newsCloseLightbox}
        </button>
      </div>
    </div>
  `;

  lightbox.classList.remove("hidden");
  lockPageScroll();
  setTimeout(() => {
    lightbox.classList.remove("opacity-0");
  }, 10);

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function closeNewsLightbox() {
  const lightbox = document.getElementById("news-lightbox");
  if (!lightbox) return;
  lightbox.classList.add("opacity-0");
  setTimeout(() => {
    lightbox.classList.add("hidden");
    unlockPageScrollIfNoOverlay();
  }, 250);
}

// ==========================================
// 11. MENTORS FILTERING & RENDERING
// ==========================================

let currentMentorsFilter = "all";

function renderMentors(filter = "all") {
  currentMentorsFilter = filter;
  const container = document.getElementById("mentors-grid");
  if (!container) return;

  const filtered = filter === "all"
    ? MENTORS_DATA
    : MENTORS_DATA.filter((m) => m.category === filter);

  container.innerHTML = "";

  filtered.forEach((m) => {
    const card = document.createElement("div");
    card.className = "glass-panel glass-panel-hover rounded-2xl p-6 text-center flex flex-col items-center justify-between transition-all";

    const skillsHtml = m.skills
      .map(
        (s) => `
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-slate-600 border border-slate-200">
          ${s}
        </span>`
      )
      .join("");

    card.innerHTML = `
      <div class="flex flex-col items-center w-full">
        <!-- Uniform rounded-2xl glass frame styling for profile photo container -->
        <div class="relative w-24 h-24 mb-4 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg p-1 bg-white backdrop-blur-sm">
          <img 
            src="${m.avatar}" 
            alt="${m.name}" 
            class="w-full h-full object-cover object-center rounded-xl" 
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none"></div>
        </div>

        <h3 class="text-lg font-bold text-slate-900">${m.name}</h3>
        <p class="text-xs text-blue-700 font-medium mb-3">${m.role[currentLang]}</p>

        <div class="flex flex-wrap justify-center gap-1.5 mb-5">
          ${skillsHtml}
        </div>
      </div>

      <div class="flex items-center gap-2.5 pt-3 border-t border-slate-200 w-full justify-center">
        ${
          m.socials.linkedin
            ? `<a href="${m.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M5.37 3.5A2.37 2.37 0 1 1 5.36 8.24 2.37 2.37 0 0 1 5.37 3.5ZM3.32 9.82h4.1V22h-4.1V9.82Zm6.63 0h3.93v1.66h.06c.55-1.04 1.88-2.14 3.87-2.14 4.14 0 4.9 2.73 4.9 6.27V22h-4.09v-5.66c0-1.35-.03-3.09-1.88-3.09-1.88 0-2.17 1.47-2.17 2.99V22H9.95V9.82Z"/>
                </svg>
              </a>`
            : ""
        }
        ${
          m.socials.github
            ? `<a href="${m.socials.github}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .08 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.94a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.04.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"/>
                </svg>
              </a>`
            : ""
        }
      </div>
    `;

    container.appendChild(card);
  });

  // Update tabs visual state
  document.querySelectorAll(".mentor-filter-btn").forEach((btn) => {
    const tabFilter = btn.getAttribute("data-filter");
    if (tabFilter === filter) {
      btn.className = "mentor-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-slate-900";
    } else {
      btn.className = "mentor-filter-btn px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 transition-all";
    }
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

// ==========================================
// 12. DYNAMIC MODAL CONTROLLER & 4 FORMS
// ==========================================

let currentActiveModalType = null;
let currentActiveModalData = null;

/**
 * openModal(type, data)
 * Dynamically switches between 4 distinct forms:
 * - 'idea': Incubation / Idea Submission
 * - 'program': Program Application
 * - 'event': Event Registration
 * - 'mentor': Mentor Network
 */
function openModal(type = "idea", data = null, preserveValues = false) {
  currentActiveModalType = type;
  currentActiveModalData = data;

  const modal = document.getElementById("universal-modal");
  const headerIcon = document.getElementById("modal-header-icon");
  const titleEl = document.getElementById("modal-title");
  const descEl = document.getElementById("modal-desc");
  const container = document.getElementById("dynamic-form-container");
  const successState = document.getElementById("modal-success");

  if (!modal || !container || !successState) return;

  const existingForm = document.getElementById("modal-active-form");
  const preservedValues = preserveValues && existingForm instanceof HTMLFormElement
    ? new FormData(existingForm)
    : null;

  // Reset success state
  successState.classList.add("hidden");
  container.classList.remove("hidden");

  let formHtml = "";
  const t = translations[currentLang];

  if (type === "program") {
    // Form 2: Program Application
    const selectedProgramObj = PROGRAMS_DATA.find((p) => p.id === data);
    const prefillTitle = selectedProgramObj ? selectedProgramObj.title[currentLang] : (typeof data === "string" ? data : "");

    headerIcon.innerHTML = `<i data-lucide="graduation-cap" class="w-5 h-5 text-blue-700"></i>`;
    titleEl.textContent = t.formProgramTitle;
    descEl.textContent = t.formProgramDesc;

    formHtml = `
      <form id="modal-active-form" onsubmit="handleModalSubmit(event, 'program')" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldFullName}</label>
          <input 
            type="text" 
            name="fullName" 
            required 
            placeholder="${t.fieldFullName.replace(' *', '')}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldEmail}</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="ad@example.com"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldPhone}</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder="+994 (50) 000-00-00"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldSelectedProgram}</label>
          <select 
            name="selectedProgram" 
            required
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          >
            ${PROGRAMS_DATA.map((p) => `
              <option value="${p.id}" ${p.id === data || p.title[currentLang] === prefillTitle ? "selected" : ""}>
                ${p.title[currentLang]}
              </option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldUniversityFaculty}</label>
          <input 
            type="text" 
            name="faculty" 
            required 
            placeholder="${t.univPlaceholder}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button 
            type="button" 
            onclick="closeModal()" 
            class="btn-secondary w-full sm:w-auto px-5 py-2.5 text-sm"
          >
            ${t.modalCloseBtn}
          </button>
          <button 
            id="modal-submit-btn" 
            type="submit" 
            class="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm"
          >
            <span>${t.btnSubmitProgram}</span>
          </button>
        </div>
      </form>
    `;

  } else if (type === "event") {
    // Form 3: Event Registration
    const selectedEventObj = EVENTS_DATA.find((e) => e.id === data);
    const eventTitle = selectedEventObj ? selectedEventObj.title[currentLang] : (typeof data === "string" ? data : "");

    headerIcon.innerHTML = `<i data-lucide="calendar" class="w-5 h-5 text-amber-700"></i>`;
    titleEl.textContent = t.formEventTitle;
    descEl.textContent = t.formEventDesc;

    formHtml = `
      <form id="modal-active-form" onsubmit="handleModalSubmit(event, 'event')" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldFullName}</label>
          <input 
            type="text" 
            name="fullName" 
            required 
            placeholder="${t.fieldFullName.replace(' *', '')}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldEmail}</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="ad@example.com"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldPhone}</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder="+994 (50) 000-00-00"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldEventTitle}</label>
          <select 
            name="eventTitle" 
            required
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          >
            ${EVENTS_DATA.map((e) => `
              <option value="${e.id}" ${e.id === data || e.title[currentLang] === eventTitle ? "selected" : ""}>
                ${e.title[currentLang]}
              </option>
            `).join("")}
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldAttendanceFormat}</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-cyan-500/50">
              <input type="radio" name="format" value="in-person" checked class="text-cyan-500 focus:ring-0" />
              <span class="text-xs font-medium text-slate-700">${t.formatInPerson}</span>
            </label>
            <label class="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-cyan-500/50">
              <input type="radio" name="format" value="online" class="text-cyan-500 focus:ring-0" />
              <span class="text-xs font-medium text-slate-700">${t.formatOnline}</span>
            </label>
          </div>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button 
            type="button" 
            onclick="closeModal()" 
            class="btn-secondary w-full sm:w-auto px-5 py-2.5 text-sm"
          >
            ${t.modalCloseBtn}
          </button>
          <button 
            id="modal-submit-btn" 
            type="submit" 
            class="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm"
          >
            <span>${t.btnSubmitEvent}</span>
          </button>
        </div>
      </form>
    `;

  } else if (type === "mentor") {
    // Form 4: Mentor Network
    headerIcon.innerHTML = `<i data-lucide="award" class="w-5 h-5 text-emerald-700"></i>`;
    titleEl.textContent = t.formMentorTitle;
    descEl.textContent = t.formMentorDesc;

    formHtml = `
      <form id="modal-active-form" onsubmit="handleModalSubmit(event, 'mentor')" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldFullName}</label>
          <input 
            type="text" 
            name="fullName" 
            required 
            placeholder="${t.fieldFullName.replace(' *', '')}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldEmail}</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="mentor@example.com"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldPhone}</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder="+994 (50) 000-00-00"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldCompanyRole}</label>
          <input 
            type="text" 
            name="companyRole" 
            required 
            placeholder="${t.companyRolePlaceholder}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldExpertise}</label>
          <select 
            name="expertise" 
            required
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          >
            <option value="it">${t.expertiseIT}</option>
            <option value="marketing">${t.expertiseMarketing}</option>
            <option value="business">${t.expertiseBusiness}</option>
            <option value="design">${t.expertiseDesign}</option>
            <option value="finance">${t.expertiseFinance}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldLinkedIn}</label>
          <input 
            type="url" 
            name="linkedin" 
            required 
            placeholder="https://linkedin.com/in/profil"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldShortBio}</label>
          <textarea 
            name="bio" 
            rows="3" 
            required 
            placeholder="${t.bioPlaceholderMentor}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button 
            type="button" 
            onclick="closeModal()" 
            class="btn-secondary w-full sm:w-auto px-5 py-2.5 text-sm"
          >
            ${t.modalCloseBtn}
          </button>
          <button 
            id="modal-submit-btn" 
            type="submit" 
            class="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm"
          >
            <span>${t.btnSubmitMentor}</span>
          </button>
        </div>
      </form>
    `;

  } else {
    // Form 1: Incubation / Idea Submission (Default)
    headerIcon.innerHTML = `<i data-lucide="rocket" class="w-5 h-5 text-blue-700"></i>`;
    titleEl.textContent = t.formIdeaTitle;
    descEl.textContent = t.formIdeaDesc;

    formHtml = `
      <form id="modal-active-form" onsubmit="handleModalSubmit(event, 'idea')" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldFullName}</label>
          <input 
            type="text" 
            name="fullName" 
            required 
            placeholder="${t.fieldFullName.replace(' *', '')}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldEmail}</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="ad@example.com"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldPhone}</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder="+994 (50) 000-00-00"
              class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldStartupTitle}</label>
          <input 
            type="text" 
            name="startupTitle" 
            required 
            placeholder="Məs: Smart Sensor Grid"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldStage}</label>
          <select 
            name="stage" 
            required
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
          >
            <option value="idea">${t.stageIdea}</option>
            <option value="mvp">${t.stageMVP}</option>
            <option value="sales">${t.stageSales}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">${t.fieldDescription}</label>
          <textarea 
            name="description" 
            rows="3" 
            required 
            placeholder="${t.descPlaceholderIdea}"
            class="w-full bg-white border border-slate-200 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-900 text-sm rounded-xl px-4 py-2.5 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button 
            type="button" 
            onclick="closeModal()" 
            class="btn-secondary w-full sm:w-auto px-5 py-2.5 text-sm"
          >
            ${t.modalCloseBtn}
          </button>
          <button 
            id="modal-submit-btn" 
            type="submit" 
            class="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm"
          >
            <span>${t.btnSubmitIdea}</span>
          </button>
        </div>
      </form>
    `;
  }

  container.innerHTML = formHtml;

  if (preservedValues) {
    const activeForm = document.getElementById("modal-active-form");
    preservedValues.forEach((value, name) => {
      const field = activeForm?.elements.namedItem(name);
      if (field && "value" in field) field.value = value;
    });
  }

  modal.classList.remove("hidden");
  lockPageScroll();
  setTimeout(() => {
    modal.classList.remove("opacity-0");
  }, 10);

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

function closeModal() {
  const modal = document.getElementById("universal-modal");
  if (!modal) return;
  modal.classList.add("opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    currentActiveModalType = null;
    currentActiveModalData = null;
    unlockPageScrollIfNoOverlay();
  }, 250);
}

function handleModalSubmit(e, formType) {
  e.preventDefault();
  const form = e.currentTarget;
  const submitBtn = form?.querySelector("#modal-submit-btn");
  const container = document.getElementById("dynamic-form-container");
  const successState = document.getElementById("modal-success");
  const successTitle = document.getElementById("modal-success-title");
  const successDesc = document.getElementById("modal-success-desc");

  if (!(form instanceof HTMLFormElement) || !submitBtn || !container || !successState) return;

  const t = translations[currentLang];
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.setAttribute("aria-busy", "true");
  submitBtn.innerHTML = `<span>${t.btnSubmitting}</span>`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.removeAttribute("aria-busy");
    submitBtn.innerHTML = originalText;

    // Set custom success messaging according to form type
    if (formType === "program") {
      successTitle.textContent = t.successTitleProgram;
      successDesc.textContent = t.successDescProgram;
    } else if (formType === "event") {
      successTitle.textContent = t.successTitleEvent;
      successDesc.textContent = t.successDescEvent;
    } else if (formType === "mentor") {
      successTitle.textContent = t.successTitleMentor;
      successDesc.textContent = t.successDescMentor;
    } else {
      successTitle.textContent = t.successTitleIdea;
      successDesc.textContent = t.successDescIdea;
    }

    container.classList.add("hidden");
    successState.classList.remove("hidden");
  }, 750);
}

// ==========================================
// 13. FLOATING BACK TO TOP BUTTON LOGIC
// ==========================================

function initBackToTop() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  });
}

// ==========================================
// 14. DOM INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Renders
  renderPrograms("all");
  renderPastPrograms();
  renderStartups();
  renderEvents();
  renderNews();
  renderMentors("all");

  // 2. Initialize observers and features
  initStatsCounter();
  initScrollAnimations();
  initTimelineScrollObserver();
  keepTimelineConnectorAligned();
  window.addEventListener("resize", alignTimelineConnector);
  initBackToTop();

  // 3. Language button listener
  const langToggleBtn = document.getElementById("lang-toggle-btn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const nextLang = currentLang === "az" ? "en" : "az";
      updateLanguage(nextLang);
    });
  }

  // 4. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // 5. Global Escape key handling
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeStartupModal();
      closeNewsLightbox();
      closeDetailsModal();
    }
  });

  // 6. Initial Lucide icons initialization
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
});

// Expose functions globally for HTML inline onclick handlers
window.updateLanguage = updateLanguage;
window.renderPrograms = renderPrograms;
window.renderMentors = renderMentors;
window.openStartupModal = openStartupModal;
window.closeStartupModal = closeStartupModal;
window.openNewsLightbox = openNewsLightbox;
window.closeNewsLightbox = closeNewsLightbox;
window.openDetailsModal = openDetailsModal;
window.closeDetailsModal = closeDetailsModal;
window.openModal = openModal;
window.closeModal = closeModal;
window.openUniversalModal = (type, data) => openModal(type, data);
window.closeUniversalModal = closeModal;
window.handleModalSubmit = handleModalSubmit;


