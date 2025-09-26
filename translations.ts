export const translations = {
  en: {
    // Header
    title: 'AI Math Solver',
    madeBy: 'Made By Omar Abdullah Alshahrani',
    description: 'Get step-by-step solutions and chat with an AI tutor.',
    about: 'About',
    selectFont: 'Select font',
    factOfTheDay: 'Math Fact of the Day',
    loadingData: 'Loading new examples and facts...',

    // Problem Input
    enterProblem: 'Enter Your Math Problem',
    placeholder: 'e.g., Solve for x: 2x + 5 = 15 or use LaTeX like $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$',
    exampleProblems: 'Or try an example:',
    solve: 'Solve Problem',
    solving: 'Solving...',
    clear: 'Clear',
    uploadImage: 'Upload Image',
    or: 'OR',
    imageSelected: 'Image selected. Ready to solve.',
    removeImage: 'Remove Image',
    livePreview: 'Live Preview',

    // Solution Display
    analysis: 'Analysis',
    advancedAnalysis: 'Advanced Analysis',
    problemClassification: 'Problem Classification',
    difficulty: 'Difficulty',
    difficultyJustification: 'Difficulty Justification',
    keyConcepts: 'Key Concepts',
    alternativeMethods: 'Alternative Methods',
    commonPitfalls: 'Common Pitfalls',
    analyzing: 'AI is analyzing your problem...',
    errorOccurred: 'An Error Occurred',
    solutionPlaceholder: 'Your solution will appear here.',
    solved: 'Solved',
    unsolved: 'Unsolved / Conceptual',
    stepByStep: 'Step-by-step Solution:',
    detailedExplanation: 'Detailed Explanation:',

    // Chat
    tutorTitle: 'AI Math Tutor',
    followUpPlaceholder: 'The AI Tutor is ready. Ask any math question!',
    askAQuestion: 'Ask any math question...',
    disabledChatPlaceholder: 'Solve a problem first to enable chat',
    chatError: "Sorry, I encountered an error. Please try again.",
    newChat: 'New Chat',

    // About Modal
    aboutTitle: 'About AI Math Solver',
    aboutText1: 'This application is an AI-powered math problem solver designed to assist students, educators, and enthusiasts. It can identify problems as solved or unsolved, provide step-by-step solutions or detailed explanations for conceptual questions, and offers an interactive AI chat for further assistance.',
    aboutText2: 'Built with React, TypeScript, Tailwind CSS, and powered by the Google Gemini API.',
    close: 'Close',

    // History
    historyTitle: 'Problem History',
    noHistory: 'No history yet. Solve a problem to see it here.',
    clearHistory: 'Clear History',
    confirmClearHistory: 'Are you sure you want to clear all history? This action cannot be undone.',
    confirmClear: 'Clear',
    cancel: 'Cancel',

    // Share
    share: 'Share',
    copyLink: 'Copy Link',
    downloadImage: 'Download as Image',
    linkCopied: 'Link Copied!',
    generatingImage: 'Generating...',
    shareLinkDisabledTooltip: 'Link sharing is only available for text-based problems.',
  },
  ar: {
    // Header
    title: 'حلّال الرياضيات بالذكاء الاصطناعي',
    madeBy: 'صنع بواسطة عمر عبدالله الشهراني',
    description: 'احصل على حلول خطوة بخطوة وتحدث مع مدرس ذكاء اصطناعي.',
    about: 'حول',
    selectFont: 'اختر الخط',
    factOfTheDay: 'حقيقة اليوم في الرياضيات',
    loadingData: '...جاري تحميل أمثلة وحقائق جديدة',

    // Problem Input
    enterProblem: 'أدخل مسألتك الرياضية',
    placeholder: 'مثال: حل لـ س: 2س + 5 = 15 أو استخدم LaTeX مثل $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$',
    exampleProblems: 'أو جرب مثالاً:',
    solve: 'حل المسألة',
    solving: 'جارٍ الحل...',
    clear: 'مسح',
    uploadImage: 'رفع صورة',
    or: 'أو',
    imageSelected: 'تم اختيار الصورة. جاهز للحل.',
    removeImage: 'إزالة الصورة',
    livePreview: 'معاينة حية',

    // Solution Display
    analysis: 'التحليل',
    advancedAnalysis: 'تحليل متقدم',
    problemClassification: 'تصنيف المسألة',
    difficulty: 'مستوى الصعوبة',
    difficultyJustification: 'مبرر الصعوبة',
    keyConcepts: 'المفاهيم الأساسية',
    alternativeMethods: 'طرق بديلة',
    commonPitfalls: 'الأخطاء الشائعة',
    analyzing: 'الذكاء الاصطناعي يحلل مسألتك...',
    errorOccurred: 'حدث خطأ',
    solutionPlaceholder: 'سيظهر حلك هنا.',
    solved: 'تم الحل',
    unsolved: 'غير محلولة / مفهومية',
    stepByStep: 'الحل خطوة بخطوة:',
    detailedExplanation: 'شرح مفصل:',

    // Chat
    tutorTitle: 'مدرس الرياضيات الذكي',
    followUpPlaceholder: 'مدرس الذكاء الاصطناعي جاهز. اطرح أي سؤال في الرياضيات!',
    askAQuestion: 'اطرح أي سؤال في الرياضيات...',
    disabledChatPlaceholder: 'حل مسألة أولاً لتفعيل الدردشة',
    chatError: "عذراً، واجهت خطأ. يرجى المحاولة مرة أخرى.",
    newChat: 'محادثة جديدة',

    // About Modal
    aboutTitle: 'حول حلّال الرياضيات بالذكاء الاصطناعي',
    aboutText1: 'هذا التطبيق هو حل مسائل رياضية مدعوم بالذكاء الاصطناعي مصمم لمساعدة الطلاب والمعلمين والمتحمسين. يمكنه تحديد المسائل على أنها محلولة أو غير محلولة، وتقديم حلول خطوة بخطوة أو شروحات مفصلة للأسئلة المفاهيمية، ويوفر دردشة تفاعلية مع الذكاء الاصطناعي لمزيد من المساعدة.',
    aboutText2: 'تم بناؤه باستخدام React و TypeScript و Tailwind CSS ومدعوم بواجهة برمجة تطبيقات Google Gemini.',
    close: 'إغلاق',

    // History
    historyTitle: 'سجل المسائل',
    noHistory: 'لا يوجد سجل حتى الآن. قم بحل مسألة لرؤيتها هنا.',
    clearHistory: 'مسح السجل',
    confirmClearHistory: 'هل أنت متأكد أنك تريد مسح كل السجل؟ لا يمكن التراجع عن هذا الإجراء.',
    confirmClear: 'مسح',
    cancel: 'إلغاء',

    // Share
    share: 'مشاركة',
    copyLink: 'نسخ الرابط',
    downloadImage: 'تنزيل كصورة',
    linkCopied: 'تم نسخ الرابط!',
    generatingImage: 'جارٍ الإنشاء...',
    shareLinkDisabledTooltip: 'مشاركة الرابط متاحة فقط للمسائل النصية.',
  },
};