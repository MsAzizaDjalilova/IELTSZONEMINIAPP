// Boshlang'ich kurslar (ieltszone.uz ma'lumotlari asosida).
// Ishga tushirish: npm run seed  (mavjud kurslar o'zgartirilmaydi)

const BRANCHES = ['integro', 'amir-temur', 'drujba'];

const COURSES = [
  {
    slug: 'ielts-standard',
    category: 'IELTS',
    featured: true,
    sortOrder: 1,
    newPrice: 1090000,
    seatsLeft: 6,
    formats: BRANCHES,
    title: { uz: 'IELTS Standard', ru: 'IELTS Standard', en: 'IELTS Standard' },
    outcome: {
      uz: 'Band 6.0–7.5 uchun tizimli tayyorgarlik',
      ru: 'Системная подготовка к Band 6.0–7.5',
      en: 'Structured preparation for Band 6.0–7.5',
    },
    description: {
      uz: 'Band 8.5–9.0 ustozlar bilan to‘rtta ko‘nikma bo‘yicha to‘liq IELTS kursi. Muntazam CD Mock imtihonlari va Bekzod Mirahmedovning Writing Marathon’i.',
      ru: 'Полный курс IELTS по четырём навыкам с преподавателями Band 8.5–9.0. Регулярные CD Mock экзамены и Writing Marathon от Бекзода Мирахмедова.',
      en: 'A full four-skill IELTS course with Band 8.5–9.0 teachers. Regular CD Mock exams and a Writing Marathon by Bekzod Mirahmedov.',
    },
    duration: {
      uz: '3 oy · haftada 3 kun · 1 soat 45 daqiqa',
      ru: '3 месяца · 3 раза в неделю · 1 ч 45 мин',
      en: '3 months · 3 days a week · 1h 45m',
    },
    features: {
      uz: ['Band 8.5–9.0 o‘qituvchilar', 'Bekzod Mirahmedov tomonidan Writing Marathon', '70%+ instructorlar CELTA sertifikatiga ega', '2 ta ustoz bilan ishlash imkoniyati', 'Guruhda o‘rtacha 15 nafar o‘quvchi', 'Imtihonni markazning o‘zida topshirish imkoniyati', 'Qulay co-working'],
      ru: ['Преподаватели Band 8.5–9.0', 'Writing Marathon от Бекзода Мирахмедова', '70%+ инструкторов с сертификатом CELTA', 'Работа с двумя преподавателями', 'В среднем 15 студентов в группе', 'Сдача экзамена прямо в центре', 'Удобный co-working'],
      en: ['Band 8.5–9.0 teachers', 'Writing Marathon by Bekzod Mirahmedov', '70%+ of instructors are CELTA-certified', 'Work with 2 teachers', 'About 15 students per group', 'Take the official exam at the centre', 'Comfortable co-working space'],
    },
  },
  {
    slug: 'ielts-intensive',
    category: 'IELTS',
    sortOrder: 2,
    newPrice: 1900000,
    seatsLeft: 4,
    formats: BRANCHES,
    title: { uz: 'IELTS Intensive', ru: 'IELTS Intensive', en: 'IELTS Intensive' },
    outcome: {
      uz: 'Qisqa muddatda imtihonga tayyorlanish va balni oshirish',
      ru: 'Быстрая подготовка к экзамену и рост балла',
      en: 'Fast exam preparation and a higher band',
    },
    description: {
      uz: 'IELTS bosqichidagi o‘quvchilar uchun 1,5 oylik tezlashtirilgan kurs. Imtihon sanasi yaqin bo‘lganlar uchun maxsus ishlab chiqilgan.',
      ru: 'Ускоренный курс на 1,5 месяца для студентов уровня IELTS. Создан для тех, у кого скоро экзамен.',
      en: 'A 1.5-month accelerated course for students already at IELTS level. Built for those with an exam date coming up.',
    },
    duration: { uz: '1,5 oy · intensiv format', ru: '1,5 месяца · интенсив', en: '1.5 months · intensive' },
    features: {
      uz: ['Band 8.5–9.0 o‘qituvchilar', 'Bekzod Mirahmedov tomonidan Writing Marathon', '70%+ instructorlar CELTA sertifikatiga ega', '2 ta ustoz bilan ishlash imkoniyati', 'Imtihonni markazning o‘zida topshirish imkoniyati'],
      ru: ['Преподаватели Band 8.5–9.0', 'Writing Marathon от Бекзода Мирахмедова', '70%+ инструкторов с сертификатом CELTA', 'Работа с двумя преподавателями', 'Сдача экзамена прямо в центре'],
      en: ['Band 8.5–9.0 teachers', 'Writing Marathon by Bekzod Mirahmedov', '70%+ of instructors are CELTA-certified', 'Work with 2 teachers', 'Take the official exam at the centre'],
    },
  },
  {
    slug: 'ielts-expert',
    category: 'IELTS',
    sortOrder: 3,
    newPrice: 1300000,
    seatsLeft: 5,
    formats: BRANCHES,
    title: { uz: 'IELTS Expert', ru: 'IELTS Expert', en: 'IELTS Expert' },
    outcome: { uz: '7.0 dan 8.0+ gacha', ru: 'С 7.0 до 8.0+', en: 'From 7.0 to 8.0+' },
    description: {
      uz: 'IELTS 7.0 balga ega bo‘lib, uni 8.0+ ga ko‘tarmoqchi bo‘lganlar uchun. Darslarni IELTS 9.0 balli professional instructorlar olib boradi.',
      ru: 'Для тех, у кого уже есть 7.0 и кто хочет 8.0+. Занятия ведут профессиональные инструкторы с IELTS 9.0.',
      en: 'For students who already have 7.0 and want 8.0+. Taught by professional instructors with IELTS 9.0.',
    },
    duration: {
      uz: '3 oy · haftada 3 kun · 1 soat 45 daqiqa',
      ru: '3 месяца · 3 раза в неделю · 1 ч 45 мин',
      en: '3 months · 3 days a week · 1h 45m',
    },
    features: {
      uz: ['Faqat IELTS 9.0 instructorlar', 'Bekzod Mirahmedov tomonidan Writing Marathon', 'Native speaker bilan Speaking Club', 'CD Mock: 9.0 ustozlar va native speakerlar tekshiradi'],
      ru: ['Только инструкторы с IELTS 9.0', 'Writing Marathon от Бекзода Мирахмедова', 'Speaking Club с носителем языка', 'CD Mock проверяют преподаватели 9.0 и носители'],
      en: ['IELTS 9.0 instructors only', 'Writing Marathon by Bekzod Mirahmedov', 'Speaking Club with a native speaker', 'CD Mocks checked by 9.0 teachers and native speakers'],
    },
  },
  {
    slug: 'ielts-online',
    category: 'IELTS',
    sortOrder: 4,
    newPrice: 650000,
    seatsLeft: 9,
    formats: ['online'],
    title: { uz: 'IELTS Online', ru: 'IELTS Online', en: 'IELTS Online' },
    outcome: {
      uz: 'Istalgan shahardan jonli IELTS darslari',
      ru: 'Живые уроки IELTS из любого города',
      en: 'Live IELTS lessons from any city',
    },
    description: {
      uz: 'Zoom orqali jonli darslar — offline kurs bilan bir xil ustozlar va metodika. Masofa endi to‘siq emas.',
      ru: 'Живые уроки в Zoom — те же преподаватели и методика, что и офлайн. Расстояние больше не помеха.',
      en: 'Live lessons on Zoom with the same teachers and method as offline. Distance is no longer a barrier.',
    },
    duration: { uz: '3 oy · Zoom orqali jonli', ru: '3 месяца · живые уроки в Zoom', en: '3 months · live on Zoom' },
    features: {
      uz: ['Band 8.5–9.0 o‘qituvchilar', 'Bekzod Mirahmedov tomonidan Writing Marathon', '70%+ instructorlar CELTA sertifikatiga ega', '2 ta ustoz bilan ishlash imkoniyati', 'Zoom orqali jonli darslar'],
      ru: ['Преподаватели Band 8.5–9.0', 'Writing Marathon от Бекзода Мирахмедова', '70%+ инструкторов с сертификатом CELTA', 'Работа с двумя преподавателями', 'Живые уроки в Zoom'],
      en: ['Band 8.5–9.0 teachers', 'Writing Marathon by Bekzod Mirahmedov', '70%+ of instructors are CELTA-certified', 'Work with 2 teachers', 'Live lessons on Zoom'],
    },
  },
  {
    slug: 'general-english',
    category: 'GENERAL',
    featured: true,
    sortOrder: 5,
    newPrice: 990000,
    seatsLeft: 7,
    formats: [...BRANCHES, 'online'],
    title: { uz: 'General English', ru: 'General English', en: 'General English' },
    outcome: {
      uz: 'Noldan Intermediate gacha — IELTS’ga mustahkam poydevor',
      ru: 'С нуля до Intermediate — прочная база для IELTS',
      en: 'From zero to Intermediate — a solid base for IELTS',
    },
    description: {
      uz: 'Beginner, Elementary, Pre-Intermediate va Intermediate darajalari. Ingliz tilini noldan boshlab, keyin IELTS’ga o‘tasiz.',
      ru: 'Уровни Beginner, Elementary, Pre-Intermediate и Intermediate. Начните английский с нуля и переходите к IELTS.',
      en: 'Beginner, Elementary, Pre-Intermediate and Intermediate levels. Start English from zero, then move on to IELTS.',
    },
    duration: {
      uz: '3 oy · haftada 3 kun · 1 soat 50 daqiqa',
      ru: '3 месяца · 3 раза в неделю · 1 ч 50 мин',
      en: '3 months · 3 days a week · 1h 50m',
    },
    features: {
      uz: ['Band 8.0+ o‘qituvchilar', 'Bepul kitob va daftarlar', '2 ta ustoz bilan ishlash imkoniyati', 'Native speaker bilan Speaking Club', '70%+ instructorlar CELTA sertifikatiga ega', 'Qulay co-working'],
      ru: ['Преподаватели Band 8.0+', 'Бесплатные книги и тетради', 'Работа с двумя преподавателями', 'Speaking Club с носителем языка', '70%+ инструкторов с сертификатом CELTA', 'Удобный co-working'],
      en: ['Band 8.0+ teachers', 'Free books and notebooks', 'Work with 2 teachers', 'Speaking Club with a native speaker', '70%+ of instructors are CELTA-certified', 'Comfortable co-working space'],
    },
  },
  {
    slug: 'cefr',
    category: 'CEFR',
    sortOrder: 6,
    newPrice: null,
    seatsLeft: null,
    formats: [...BRANCHES, 'online'],
    title: { uz: 'CEFR (Multilevel)', ru: 'CEFR (Multilevel)', en: 'CEFR (Multilevel)' },
    outcome: { uz: 'B2 / C1 milliy sertifikati', ru: 'Национальный сертификат B2 / C1', en: 'National B2 / C1 certificate' },
    description: {
      uz: 'Milliy CEFR (Multilevel) imtihoniga tayyorgarlik: format, strategiyalar va mock testlar.',
      ru: 'Подготовка к национальному экзамену CEFR (Multilevel): формат, стратегии и mock-тесты.',
      en: 'Preparation for the national CEFR (Multilevel) exam: format, strategies and mock tests.',
    },
    duration: { uz: 'Davomiyligini administrator aytadi', ru: 'Длительность уточните у администратора', en: 'Ask admissions for duration' },
    features: {
      uz: ['Imtihon formatiga moslangan darslar', 'Muntazam mock testlar', 'Bepul support teacher'],
      ru: ['Уроки под формат экзамена', 'Регулярные mock-тесты', 'Бесплатный support teacher'],
      en: ['Lessons tailored to the exam format', 'Regular mock tests', 'Free support teacher'],
    },
  },
  {
    slug: 'sat',
    category: 'SAT',
    sortOrder: 7,
    newPrice: null,
    seatsLeft: null,
    formats: [...BRANCHES, 'online'],
    title: { uz: 'SAT', ru: 'SAT', en: 'SAT' },
    outcome: { uz: 'Xorijiy universitetlar uchun SAT', ru: 'SAT для зарубежных вузов', en: 'SAT for universities abroad' },
    description: {
      uz: 'Math va Reading & Writing bo‘limlari bo‘yicha Digital SAT’ga tayyorgarlik.',
      ru: 'Подготовка к Digital SAT: Math и Reading & Writing.',
      en: 'Digital SAT preparation: Math and Reading & Writing.',
    },
    duration: { uz: 'Davomiyligini administrator aytadi', ru: 'Длительность уточните у администратора', en: 'Ask admissions for duration' },
    features: {
      uz: ['Math va Reading & Writing', 'Amaliy testlar', 'Bepul support teacher'],
      ru: ['Math и Reading & Writing', 'Практические тесты', 'Бесплатный support teacher'],
      en: ['Math and Reading & Writing', 'Practice tests', 'Free support teacher'],
    },
  },
  {
    slug: 'kids',
    category: 'KIDS',
    sortOrder: 8,
    newPrice: null,
    seatsLeft: null,
    formats: BRANCHES,
    title: { uz: 'Kids English', ru: 'Kids English', en: 'Kids English' },
    outcome: { uz: 'Bolalar uchun qiziqarli ingliz tili', ru: 'Увлекательный английский для детей', en: 'Fun English for children' },
    description: {
      uz: 'Bolalar uchun o‘yin va muloqot orqali ingliz tili. Keyinchalik General English va IELTS’ga tayyor poydevor.',
      ru: 'Английский для детей через игру и общение. Готовая база для General English и IELTS.',
      en: 'English for children through games and conversation. A ready base for General English and IELTS later.',
    },
    duration: { uz: 'Davomiyligini administrator aytadi', ru: 'Длительность уточните у администратора', en: 'Ask admissions for duration' },
    features: {
      uz: ['Yoshga mos metodika', 'Kichik guruhlar', 'Ota-onalar uchun hisobot'],
      ru: ['Методика по возрасту', 'Небольшие группы', 'Отчёты для родителей'],
      en: ['Age-appropriate method', 'Small groups', 'Progress reports for parents'],
    },
  },
  {
    slug: 'toefl-ibt',
    category: 'TOEFL',
    sortOrder: 9,
    newPrice: null,
    seatsLeft: null,
    formats: [...BRANCHES, 'online'],
    title: { uz: 'TOEFL iBT', ru: 'TOEFL iBT', en: 'TOEFL iBT' },
    outcome: { uz: 'AQSh universitetlari uchun TOEFL', ru: 'TOEFL для вузов США', en: 'TOEFL for US universities' },
    description: {
      uz: 'TOEFL iBT imtihoniga to‘rtta bo‘lim bo‘yicha tayyorgarlik.',
      ru: 'Подготовка к TOEFL iBT по всем четырём разделам.',
      en: 'TOEFL iBT preparation across all four sections.',
    },
    duration: { uz: 'Davomiyligini administrator aytadi', ru: 'Длительность уточните у администратора', en: 'Ask admissions for duration' },
    features: {
      uz: ['To‘rtta bo‘lim bo‘yicha strategiya', 'Amaliy testlar', 'Bepul support teacher'],
      ru: ['Стратегии по четырём разделам', 'Практические тесты', 'Бесплатный support teacher'],
      en: ['Strategies for all four sections', 'Practice tests', 'Free support teacher'],
    },
  },
];

// Faqat yo'q kurslarni qo'shadi (admin o'zgartirgan ma'lumotlar saqlanadi).
async function seedCourses(prisma, { onlyIfEmpty = false } = {}) {
  if (onlyIfEmpty && (await prisma.course.count()) > 0) return 0;
  let added = 0;
  for (const c of COURSES) {
    const exists = await prisma.course.findUnique({ where: { slug: c.slug } });
    if (exists) continue;
    await prisma.course.create({ data: c });
    added += 1;
  }
  return added;
}

module.exports = { seedCourses, COURSES };

if (require.main === module) {
  require('dotenv').config();
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  seedCourses(prisma)
    .then((n) => console.log(`🌱 Seed tayyor: ${n} ta yangi kurs qo‘shildi.`))
    .catch((e) => {
      console.error('Seed xatosi:', e.message);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
