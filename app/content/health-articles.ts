export type ArticleSource = { title: string; publisher: string; url: string };
export type ArticleSection = { id: string; title: string; paragraphs?: string[]; bullets?: string[]; sourceIds: number[] };
export type HealthArticle = {
  slug: string;
  title: string;
  seoTitle: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  introduction: string;
  sections: ArticleSection[];
  sources: ArticleSource[];
  related: string[];
};

export const healthArticles: HealthArticle[] = [
  {
    slug: "heart-healthy-habits-after-50",
    title: "Seven everyday habits that support a healthier heart",
    seoTitle: "Seven Heart-Healthy Habits After 50",
    category: "HEART HEALTH",
    summary: "Build a practical heart-health routine around movement, food, sleep, tobacco avoidance, and conversations with your care team.",
    image: "/images/heart-blood-pressure.png",
    imageAlt: "Older adult checking blood pressure at home",
    introduction: "Heart health involves everyday choices and care for conditions such as high blood pressure or diabetes. Use these seven habits as a starting point for a conversation with your care team, rather than as a personalized treatment plan.",
    sections: [
      { id: "daily-habits", title: "Seven habits to work on", sourceIds: [0, 1], bullets: [
        "Make room for regular movement. Choose activities that fit your abilities and ask about any restrictions before increasing intensity.",
        "Build meals around nutritious foods. Include vegetables, fruit, whole grains, and suitable protein foods; compare labels for sodium and saturated fat.",
        "Avoid tobacco. If you smoke, ask a clinician about support for quitting rather than relying on willpower alone.",
        "Protect a regular sleep routine. Discuss ongoing difficulty sleeping or poor sleep quality with a healthcare professional.",
        "Know your personal risk factors. Ask when your blood pressure, cholesterol, and blood sugar should be checked.",
        "Follow the care plan you agree on. If you take medicines, raise side effects or cost concerns before changing or stopping them.",
        "Make space for stress management. Choose manageable activities and support that fit your life, and ask for help when stress becomes difficult to handle."
      ] },
      { id: "make-a-plan", title: "Turn the list into one manageable change", sourceIds: [0, 1], paragraphs: [
        "Choose one habit to discuss at your next visit. Write down your starting point, the change you want to try, and any practical barrier such as pain, limited time, or food costs. A plan that accounts for those barriers is more useful than a list of ideal habits.",
        "Ask which goals matter most for your medical history and how progress will be checked. Existing heart disease may require a more specific plan; general wellness advice does not replace it."
      ] },
      { id: "questions", title: "Questions for your next appointment", sourceIds: [0], bullets: [
        "Which of my risk factors should we focus on first?",
        "What activity and food changes fit my current conditions?",
        "Which medicines or measurements should I bring to follow-up?"
      ] }
    ],
    sources: [
      { title: "Preventing Heart Disease", publisher: "CDC", url: "https://www.cdc.gov/heart-disease/prevention/index.html" },
      { title: "Heart-Healthy Living", publisher: "NHLBI, NIH", url: "https://www.nhlbi.nih.gov/health/heart-healthy-living" }
    ],
    related: ["balanced-plate-after-50", "prepare-for-a-medication-review"]
  },
  {
    slug: "staying-strong-after-50",
    title: "Your guide to staying strong after 50",
    seoTitle: "Staying Strong After 50: A Practical Guide",
    category: "AGING WELL",
    summary: "Plan a balanced movement routine that includes endurance, strength, balance, and flexibility, adapted to your abilities.",
    image: "/images/healthy-strength.png",
    imageAlt: "Older adults practicing a strength exercise",
    introduction: "Staying strong is about supporting the activities that matter to you, such as carrying shopping, getting up from a chair, or enjoying time outdoors. A useful routine includes more than one kind of movement.",
    sections: [
      { id: "four-types", title: "Include different kinds of activity", sourceIds: [0], bullets: [
        "Endurance activity, such as walking or swimming, works your breathing and heart rate.",
        "Strength activities use resistance, such as weights or resistance bands, to work muscles.",
        "Balance practice helps with stability. Choose supported activities that match your current ability.",
        "Flexibility activities help maintain movement and comfort. They complement other activity rather than replacing it."
      ] },
      { id: "starting-point", title: "Start with what you can do now", sourceIds: [0, 1], paragraphs: [
        "If you have been inactive, start gradually. Health conditions, a recent fall, or uncertainty about safe movement are good reasons to ask a clinician or physical therapist for guidance. A weekly target is not an instruction to do more than you can safely manage today.",
        "For adults 65 and older, CDC guidance includes aerobic activity, muscle-strengthening activity on at least two days a week, and balance activity. When those goals are not possible, activity should match a person's abilities and conditions."
      ] },
      { id: "planning", title: "Make a plan you can explain", sourceIds: [0], bullets: [
        "Name one everyday task you would like to make easier.",
        "Choose where you can exercise safely and what support you need.",
        "Ask which exercises, starting amount, and progression are suitable for you.",
        "Keep a brief record of what you did and any difficulties to discuss at follow-up."
      ] }
    ],
    sources: [
      { title: "Exercise for Older Adults", publisher: "MedlinePlus, National Library of Medicine", url: "https://medlineplus.gov/exerciseforolderadults.html" },
      { title: "Older Adult Activity: An Overview", publisher: "CDC", url: "https://www.cdc.gov/physical-activity-basics/guidelines/older-adults.html" }
    ],
    related: ["strength-and-balance-beyond-walking", "balanced-plate-after-50"]
  },
  {
    slug: "balanced-plate-after-50",
    title: "How to build a balanced plate",
    seoTitle: "How to Build a Balanced Plate After 50",
    category: "NUTRITION",
    summary: "Use food variety, practical meal planning, and your individual nutrition needs to build satisfying meals after 50.",
    image: "/images/balanced-cooking.png",
    imageAlt: "Older adult preparing a meal with vegetables",
    introduction: "A balanced meal is a useful planning idea, not a rule that every plate must look identical. Your appetite, culture, budget, allergies, and medical needs all matter when deciding what to eat.",
    sections: [
      { id: "food-variety", title: "Think about the foods a meal includes", sourceIds: [0, 1], paragraphs: [
        "Look for variety across vegetables and fruit, whole-grain or other suitable starchy foods, and protein foods such as beans, eggs, fish, or poultry. Dairy foods or appropriate alternatives may also help meet nutrient needs. The right amounts depend on your circumstances.",
        "Nutrition needs can change with age. Needing less energy does not mean needing fewer nutrients. Avoid treating a small appetite as a reason to rely mainly on foods that provide little nutritional value."
      ] },
      { id: "practical-meals", title: "Make the plan practical", sourceIds: [0, 1], bullets: [
        "Start with foods you already eat and identify one useful addition, such as vegetables or a protein food.",
        "Compare packaged-food labels when choosing among similar products, particularly for sodium and added sugars.",
        "Plan around cooking ability, shopping access, and food costs rather than an idealized menu.",
        "Choose drinks with your own fluid needs in mind; follow any fluid restriction your care team has prescribed."
      ] },
      { id: "personal-needs", title: "Ask for help when eating becomes difficult", sourceIds: [0], paragraphs: [
        "Dental problems, changes in taste, medicines, loneliness, and difficulty shopping or cooking can affect eating. Tell a healthcare professional if appetite changes, chewing or swallowing problems, or unintended weight changes interfere with meals.",
        "A registered dietitian or your care team can help adapt meals for conditions such as kidney disease or diabetes. A general plate guide should not override an individualized nutrition plan."
      ] }
    ],
    sources: [
      { title: "Nutrition for Older Adults", publisher: "MedlinePlus, National Library of Medicine", url: "https://medlineplus.gov/nutritionforolderadults.html" },
      { title: "Nutrition", publisher: "MedlinePlus, National Library of Medicine", url: "https://medlineplus.gov/nutrition.html" }
    ],
    related: ["heart-healthy-habits-after-50", "staying-strong-after-50"]
  },
  {
    slug: "health-screenings-after-50",
    title: "The health screenings worth discussing after age 50",
    seoTitle: "Health Screenings After 50: Questions to Ask",
    category: "PREVENTIVE CARE",
    summary: "Prepare a screening discussion based on your age, history, prior results, and preferences rather than a one-size-fits-all checklist.",
    image: "/images/appointment-questions.png",
    imageAlt: "Older adult preparing questions for a medical appointment",
    introduction: "Screening looks for some diseases before symptoms appear. Which tests are useful, and when to repeat them, depends on more than reaching a particular birthday. Use your next preventive visit to make a plan with your healthcare professional.",
    sections: [
      { id: "individual-plan", title: "Begin with your history", sourceIds: [0], paragraphs: [
        "Bring previous screening dates and results, your family history, medicines, and any relevant changes in health. Ask which screenings fit your age, anatomy, risk factors, and prior results. More testing is not automatically better; discuss possible benefits and harms.",
        "New symptoms need their own assessment. Do not wait for a routine screening appointment to ask about a concerning change, and do not assume that a previous normal screening result explains current symptoms."
      ] },
      { id: "colorectal-screening", title: "Clarify your colorectal screening plan", sourceIds: [1], paragraphs: [
        "CDC summarizes the recommendation for colorectal cancer screening for adults ages 45 to 75. For ages 76 to 85, the decision is individual. Some people need an earlier or different plan because of their history or risk factors.",
        "There are different screening tests, with different preparation and repeat schedules. Ask which option fits your circumstances, how results will arrive, and what follow-up would be needed after an abnormal result."
      ] },
      { id: "visit-checklist", title: "Leave with a clear follow-up list", sourceIds: [0, 1], bullets: [
        "Which screenings are due now, and why?",
        "What can the test tell us, and what are its limitations or possible harms?",
        "What preparation, costs, transport, or time off should I plan for?",
        "When will I get the result, and who should I contact if it does not arrive?",
        "What is the next step if the result is abnormal?"
      ] }
    ],
    sources: [
      { title: "Health Screening", publisher: "MedlinePlus, National Library of Medicine", url: "https://medlineplus.gov/healthscreening.html" },
      { title: "Screening for Colorectal Cancer", publisher: "CDC", url: "https://www.cdc.gov/colorectal-cancer/screening/index.html" }
    ],
    related: ["prepare-for-a-medication-review", "heart-healthy-habits-after-50"]
  },
  {
    slug: "strength-and-balance-beyond-walking",
    title: "Why strength and balance matter as much as walking",
    seoTitle: "Strength, Balance, and Walking as You Age",
    category: "HEALTHY AGING",
    summary: "Understand how walking, muscle strengthening, and balance practice serve different purposes in a rounded activity routine.",
    image: "/images/community-walking.png",
    imageAlt: "Older adults walking together outdoors",
    introduction: "Walking can be an accessible way to stay active, but it is only one part of a movement routine. Muscle strength and balance support different everyday tasks and deserve attention alongside aerobic activity.",
    sections: [
      { id: "different-roles", title: "Understand what each type contributes", sourceIds: [0, 1], paragraphs: [
        "Aerobic activities such as brisk walking work your heart and breathing. Strength activities challenge muscles with resistance. Balance activities develop stability and coordination. Flexibility work helps joints move more easily.",
        "These categories can overlap. A suitable group class may combine several types of activity, while a walking routine may need separate strength or balance practice. Consider what your current routine actually includes rather than counting every activity as equivalent."
      ] },
      { id: "add-safely", title: "Add activity in a way that suits you", sourceIds: [0], paragraphs: [
        "CDC describes several ways adults 65 and older can combine aerobic, strength, and balance activity. Examples are options, not prescriptions for every person. If you are unsteady, have mobility limitations, or have fallen recently, ask about suitable supervision and support before trying a balance challenge.",
        "Ask a clinician or physical therapist how to adapt a program to your current abilities. Avoid copying a difficult exercise simply because someone of a similar age can do it."
      ] },
      { id: "routine-review", title: "Review your current routine", sourceIds: [0, 1], bullets: [
        "Which activities raise my breathing or heart rate?",
        "Where does my routine include work against resistance?",
        "What appropriate balance practice am I doing, and do I need support?",
        "Which everyday movements remain difficult enough to discuss with a professional?"
      ] }
    ],
    sources: [
      { title: "What Counts as Physical Activity for Older Adults", publisher: "CDC", url: "https://www.cdc.gov/physical-activity-basics/adding-older-adults/what-counts.html" },
      { title: "Exercise and Physical Fitness", publisher: "MedlinePlus, National Library of Medicine", url: "https://medlineplus.gov/exerciseandphysicalfitness.html" }
    ],
    related: ["staying-strong-after-50", "evening-routine-for-better-sleep"]
  },
  {
    slug: "prepare-for-a-medication-review",
    title: "How to prepare for a medication review",
    seoTitle: "Medication Review Checklist for Older Adults",
    category: "MEDICATION SAFETY",
    summary: "Bring an accurate medicine list, practical concerns, and clear questions to a review with your pharmacist or prescriber.",
    image: "/images/pharmacy-guidance.png",
    imageAlt: "Pharmacist discussing medicines with an older adult",
    introduction: "A medication review is a chance to understand what you take and raise problems with the plan. Preparation helps your pharmacist or prescriber see the whole picture, including products bought without a prescription.",
    sections: [
      { id: "medicine-list", title: "Make one complete list", sourceIds: [0, 1], bullets: [
        "Include prescription medicines, over-the-counter products, vitamins, herbal products, and other supplements.",
        "Record the product name, strength, amount taken, timing, and what you understand it is for.",
        "Include medicines used only sometimes, plus allergies or previous reactions.",
        "Bring labels or containers if you are unsure of a name or strength, and check whether the clinic wants you to bring all your medicines."
      ] },
      { id: "raise-concerns", title: "Explain what happens in everyday use", sourceIds: [0, 1], paragraphs: [
        "Tell the reviewer about missed doses, side effects, cost problems, difficulty opening packaging, or trouble following the schedule. Explain what you actually take, including any differences from the label, so the discussion reflects your routine.",
        "Ask about potential interactions and whether any product duplicates another. Do not stop, change a dose, or add a supplement on the basis of a website checklist; changes should be agreed with the appropriate professional."
      ] },
      { id: "written-plan", title: "Leave with a written plan", sourceIds: [0, 1], bullets: [
        "What is each medicine for, and how should I take it?",
        "What should I do if I miss a dose of this particular medicine?",
        "Which effects or symptoms should prompt a call, and whom should I contact?",
        "If something changes, who will update the medicine list and inform my other prescribers?",
        "When should we review the plan again?"
      ] }
    ],
    sources: [
      { title: "5 Medication Safety Tips for Older Adults", publisher: "FDA", url: "https://www.fda.gov/consumers/consumer-updates/5-medication-safety-tips-older-adults" },
      { title: "As You Age: You and Your Medicines", publisher: "FDA", url: "https://www.fda.gov/drugs/information-consumers-and-patients-drugs/you-age-you-and-your-medicines" }
    ],
    related: ["health-screenings-after-50", "heart-healthy-habits-after-50"]
  },
  {
    slug: "evening-routine-for-better-sleep",
    title: "A better evening routine for more consistent sleep",
    seoTitle: "An Evening Routine for More Consistent Sleep",
    category: "SLEEP",
    summary: "Review sleep timing, your evening environment, caffeine, and ongoing sleep concerns without treating a routine as a cure for a sleep disorder.",
    image: "/images/senior-wellness.png",
    imageAlt: "Older adults spending time outdoors",
    introduction: "A consistent evening routine can support sleep, but it does not solve every sleep problem. Start with a few manageable habits and bring persistent difficulties to a healthcare professional.",
    sections: [
      { id: "regular-schedule", title: "Give your day a steady rhythm", sourceIds: [0, 1], paragraphs: [
        "Try to keep bedtime and wake-up time consistent, including on weekends. Make the period before bed calmer, with less bright light and fewer stimulating activities. Choose a routine you can repeat rather than a complicated set of rules.",
        "Regular daytime activity can be part of a sleep-supporting routine. Consider the whole day when reviewing sleep, rather than changing only what happens after you get into bed."
      ] },
      { id: "evening-checklist", title: "Review your evening habits", sourceIds: [0, 1], bullets: [
        "Keep the sleeping space quiet, dark, relaxing, and comfortably cool.",
        "Reduce screen use before bed and make time for a quieter activity.",
        "Consider whether afternoon or evening caffeine is interfering with sleep.",
        "Avoid using alcohol as a sleep aid and avoid a large meal close to bedtime.",
        "If your routine is difficult to change, choose one manageable adjustment and note what you notice."
      ] },
      { id: "ongoing-problems", title: "Discuss persistent sleep problems", sourceIds: [0, 1], paragraphs: [
        "Tell your healthcare professional if you regularly struggle to sleep or do not feel rested despite enough opportunity to sleep. A record of bedtime, waking, naps, caffeine, and daytime tiredness can help describe the pattern.",
        "General sleep habits do not diagnose or treat conditions such as sleep apnea or chronic insomnia. Ask whether further assessment is appropriate, and discuss sleep medicines or supplements with a professional rather than choosing them from a general article."
      ] }
    ],
    sources: [
      { title: "About Sleep", publisher: "CDC", url: "https://www.cdc.gov/sleep/about/index.html" },
      { title: "Healthy Sleep Habits", publisher: "NHLBI, NIH", url: "https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits" }
    ],
    related: ["strength-and-balance-beyond-walking", "prepare-for-a-medication-review"]
  }
];

export function articlePath(slug: string) { return `/health-news/${slug}`; }
export function findArticle(slug: string) { return healthArticles.find(article => article.slug === slug); }
export function articleReadTime(article: HealthArticle) {
  const words = [article.introduction, ...article.sections.flatMap(section => [...(section.paragraphs ?? []), ...(section.bullets ?? [])])].join(" ").split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} minute read`;
}

export const featuredArticles = healthArticles.slice(0, 3);
export const practicalArticles = healthArticles.slice(3);
