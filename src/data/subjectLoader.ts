import { Category, Group, Religion, SubjectGrade } from "../types";

export function getReligionSubjectName(religion: Religion): string {
  switch (religion) {
    case Religion.ISLAM:
      return "Islam and Moral Education";
    case Religion.HINDUISM:
      return "Hinduism and Moral Education";
    case Religion.BUDDHISM:
      return "Buddhism and Moral Education";
    case Religion.CHRISTIANITY:
      return "Christianity and Moral Education";
    default:
      return "Religion and Moral Education";
  }
}

export function getSubjectCode(subjectName: string): string {
  const clean = subjectName.toLowerCase().trim();
  if (clean.includes("bangla 1st")) return "101";
  if (clean.includes("bangla 2nd")) return "102";
  if (clean.includes("english 1st")) return "107";
  if (clean.includes("english 2nd")) return "108";
  if (clean.includes("mathematics") && !clean.includes("higher") && !clean.includes("engineering")) return "109";
  if (clean.includes("islam")) return "111";
  if (clean.includes("hindu")) return "112";
  if (clean.includes("buddhism") || clean.includes("buddha")) return "113";
  if (clean.includes("christ")) return "114";
  if (clean.includes("religion")) return "150";
  if (clean.includes("physics") && !clean.includes("1st") && !clean.includes("2nd") && !clean.includes("applied")) return "136";
  if (clean.includes("chemistry") && !clean.includes("1st") && !clean.includes("2nd") && !clean.includes("applied")) return "137";
  if (clean.includes("biology") && !clean.includes("1st") && !clean.includes("2nd")) return "138";
  if (clean.includes("higher mathematics") && !clean.includes("1st") && !clean.includes("2nd")) return "126";
  if (clean.includes("information and communication") || clean.includes("ict")) return "154";
  if (clean.includes("history") && !clean.includes("islamic")) return "153";
  if (clean.includes("geography")) return "110";
  if (clean.includes("civics")) return "140";
  if (clean.includes("economics") && !clean.includes("1st") && !clean.includes("2nd")) return "141";
  if (clean.includes("accounting") && !clean.includes("1st") && !clean.includes("2nd")) return "146";
  if (clean.includes("entrepreneurship")) return "143";
  if (clean.includes("finance and banking")) return "152";
  if (clean.includes("general science")) return "127";

  // HSC specific
  if (clean.includes("physics 1st")) return "174";
  if (clean.includes("physics 2nd")) return "175";
  if (clean.includes("chemistry 1st")) return "176";
  if (clean.includes("chemistry 2nd")) return "177";
  if (clean.includes("biology 1st")) return "178";
  if (clean.includes("biology 2nd")) return "179";
  if (clean.includes("higher mathematics 1st")) return "265";
  if (clean.includes("higher mathematics 2nd")) return "266";
  if (clean.includes("accounting 1st")) return "253";
  if (clean.includes("accounting 2nd")) return "254";
  if (clean.includes("business organization") && clean.includes("1st")) return "277";
  if (clean.includes("business organization") && clean.includes("2nd")) return "278";
  if (clean.includes("production management") && clean.includes("1st")) return "286";
  if (clean.includes("production management") && clean.includes("2nd")) return "287";
  if (clean.includes("finance, banking & insurance 1st") || (clean.includes("finance 1st") || clean.includes("banking 1st"))) return "292";
  if (clean.includes("finance, banking & insurance 2nd") || (clean.includes("finance 2nd") || clean.includes("banking 2nd"))) return "293";
  if (clean.includes("economics 1st")) return "109";
  if (clean.includes("economics 2nd")) return "110";
  if (clean.includes("statistics 1st")) return "129";
  if (clean.includes("statistics 2nd")) return "130";

  // Diploma / Computer Technology
  if (clean.includes("database")) return "66661";
  if (clean.includes("programming")) return "66631";
  if (clean.includes("networking")) return "66662";
  if (clean.includes("web development") || clean.includes("web design")) return "66663";
  if (clean.includes("operating system")) return "66664";
  if (clean.includes("mathematics-i")) return "65911";
  if (clean.includes("mathematics-ii")) return "65921";
  if (clean.includes("applied physics")) return "65912";
  if (clean.includes("applied chemistry")) return "65913";
  if (clean.includes("electricity") || clean.includes("electronics")) return "66711";
  if (clean.includes("applications & programming")) return "66611";
  if (clean.includes("drawing")) return "61011";
  if (clean.includes("social science")) return "65811";
  if (clean.includes("core engineering paper i")) return "62011";
  if (clean.includes("core engineering paper ii")) return "62012";
  if (clean.includes("industrial attachment")) return "69011";

  // Default hash generator for other subjects
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const code = Math.abs(hash % 900) + 100;
  return code.toString();
}

export function getFixedSubjectList(category: Category, group: Group, religion: Religion): string[] {
  if (category === Category.SSC) {
    const coreSSC = [
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Mathematics",
      getReligionSubjectName(religion)
    ];

    if (group === Group.SCIENCE) {
      return [
        ...coreSSC,
        "Physics",
        "Chemistry",
        "Biology",
        "Higher Mathematics",
        "Information and Communication Technology (ICT)"
      ];
    } else if (group === Group.HUMANITIES) {
      return [
        ...coreSSC,
        "History of Bangladesh and World Civilization",
        "Geography and Environment",
        "Civics and Citizenship",
        "Economics",
        "Information and Communication Technology (ICT)"
      ];
    } else if (group === Group.BUSINESS_STUDIES) {
      return [
        ...coreSSC,
        "Accounting",
        "Business Entrepreneurship",
        "Finance and Banking",
        "General Science",
        "Information and Communication Technology (ICT)"
      ];
    }
  }

  if (category === Category.HSC) {
    const coreHSC = [
      "Bangla 1st Paper",
      "Bangla 2nd Paper",
      "English 1st Paper",
      "English 2nd Paper",
      "Information and Communication Technology (ICT)"
    ];

    if (group === Group.SCIENCE) {
      return [
        ...coreHSC,
        "Physics 1st Paper",
        "Physics 2nd Paper",
        "Chemistry 1st Paper",
        "Chemistry 2nd Paper",
        "Biology 1st Paper",
        "Biology 2nd Paper",
        "Higher Mathematics 1st Paper",
        "Higher Mathematics 2nd Paper"
      ];
    } else if (group === Group.HUMANITIES) {
      return [
        ...coreHSC,
        "Civics and Good Governance 1st Paper",
        "Civics and Good Governance 2nd Paper",
        "Sociology 1st Paper",
        "Sociology 2nd Paper",
        "Islamic History and Culture 1st Paper",
        "Islamic History and Culture 2nd Paper",
        "Economics 1st Paper",
        "Economics 2nd Paper",
        "Agricultural Education 1st Paper",
        "Agricultural Education 2nd Paper"
      ];
    } else if (group === Group.BUSINESS_STUDIES) {
      return [
        ...coreHSC,
        "Accounting 1st Paper",
        "Accounting 2nd Paper",
        "Finance, Banking & Insurance 1st Paper",
        "Finance, Banking & Insurance 2nd Paper",
        "Business Organization and Management 1st Paper",
        "Business Organization and Management 2nd Paper",
        "Statistics 1st Paper",
        "Statistics 2nd Paper"
      ];
    }
  }

  if (category === Category.DIPLOMA) {
    if (group === Group.COMPUTER_TECHNOLOGY) {
      return [
        "Engineering Mathematics-I",
        "Applied Physics",
        "Basic Electricity & Electronics",
        "Database Management System",
        "Programming in C/C++",
        "Computer Networking",
        "Operating System",
        "Web Development & Design",
        "Social Science & Business Communication",
        "Industrial Attachment & Project"
      ];
    }

    // Default general engineering
    return [
      "Engineering Mathematics-I",
      "Engineering Mathematics-II",
      "Applied Physics",
      "Applied Chemistry",
      "Basic Electricity & Electronics",
      "Computer Applications & Programming",
      "Engineering Drawing",
      "Social Science & Business Communication",
      "Specialized Core Engineering Paper I",
      "Specialized Core Engineering Paper II",
      "Industrial Attachment & Project"
    ];
  }

  return [];
}

export function generateEmptySubjectGrades(category: Category, group: Group, religion: Religion): SubjectGrade[] {
  const list = getFixedSubjectList(category, group, religion);
  return list.map((subjectName) => ({
    subjectName,
    subjectCode: getSubjectCode(subjectName),
    marks: 85, // Default to A+ (85 marks)
    gradePoint: 5.0
  }));
}

export function getSubjectImage(subjectName: string): string {
  const clean = subjectName.toLowerCase().trim();
  
  if (clean.includes("bangla")) {
    return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=120"; // Book, literature
  }
  if (clean.includes("english")) {
    return "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=120"; // Studying English
  }
  if (clean.includes("mathematics") || clean.includes("math")) {
    return "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=120"; // Equations
  }
  if (clean.includes("islam") || clean.includes("hindu") || clean.includes("buddha") || clean.includes("christ") || clean.includes("religion") || clean.includes("moral")) {
    return "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=120"; // Moral / ethics / peace
  }
  if (clean.includes("physics")) {
    return "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=120"; // Physics
  }
  if (clean.includes("chemistry")) {
    return "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?auto=format&fit=crop&q=80&w=120"; // Chemistry
  }
  if (clean.includes("biology")) {
    return "https://images.unsplash.com/photo-1530026405186-ed1ea0007b30?auto=format&fit=crop&q=80&w=120"; // Microscope
  }
  if (clean.includes("ict") || clean.includes("information and communication") || clean.includes("computer") || clean.includes("programming") || clean.includes("database") || clean.includes("networking") || clean.includes("web") || clean.includes("operating system")) {
    return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=120"; // Coding / IT
  }
  if (clean.includes("history")) {
    return "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=120"; // History
  }
  if (clean.includes("geography")) {
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=120"; // Geography
  }
  if (clean.includes("civics") || clean.includes("social science") || clean.includes("sociology")) {
    return "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=120"; // Social
  }
  if (clean.includes("accounting") || clean.includes("economics") || clean.includes("finance") || clean.includes("business") || clean.includes("statistics") || clean.includes("management") || clean.includes("entrepreneurship")) {
    return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=120"; // Business / Economics
  }
  if (clean.includes("drawing") || clean.includes("autocad") || clean.includes("drafting")) {
    return "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=120"; // Drawing / Blueprint
  }
  if (clean.includes("electricity") || clean.includes("electronics")) {
    return "https://images.unsplash.com/photo-1517055720413-77a282491f6f?auto=format&fit=crop&q=80&w=120"; // Electronics
  }
  if (clean.includes("industrial") || clean.includes("attachment") || clean.includes("project") || clean.includes("paper")) {
    return "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=120"; // Project / Industrial
  }
  
  // Default fallback image
  return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=120"; // Education / book
}
