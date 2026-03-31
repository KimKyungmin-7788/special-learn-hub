export interface Category {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  parent?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  targetLevel: string[];
  url: string;
  thumbnail?: string;
}

export const categories: Category[] = [
  { id: "korean", name: "국어", color: "hsl(0,75%,55%)", bgColor: "hsl(0,75%,95%)", parent: "basic" },
  { id: "math", name: "수학", color: "hsl(215,80%,55%)", bgColor: "hsl(215,80%,95%)", parent: "basic" },
  { id: "social", name: "사회", color: "hsl(30,85%,55%)", bgColor: "hsl(30,85%,95%)", parent: "basic" },
  { id: "science", name: "과학", color: "hsl(145,60%,42%)", bgColor: "hsl(145,60%,93%)", parent: "basic" },
  { id: "pe", name: "체육", color: "hsl(195,80%,55%)", bgColor: "hsl(195,80%,95%)", parent: "basic" },
  { id: "music", name: "음악", color: "hsl(270,60%,58%)", bgColor: "hsl(270,60%,95%)", parent: "basic" },
  { id: "art", name: "미술", color: "hsl(330,70%,62%)", bgColor: "hsl(330,70%,95%)", parent: "basic" },
  { id: "creative", name: "창의적체험활동", color: "hsl(45,90%,55%)", bgColor: "hsl(45,90%,95%)", parent: "basic" },
  { id: "career", name: "진로와 직업", color: "hsl(230,55%,45%)", bgColor: "hsl(230,55%,93%)", parent: "elective" },
  { id: "daily", name: "일상생활", color: "hsl(90,55%,50%)", bgColor: "hsl(90,55%,93%)", parent: "elective" },
  { id: "tools", name: "업무용 앱", color: "hsl(215,10%,55%)", bgColor: "hsl(215,10%,93%)" },
  { id: "curriculum", name: "교육과정 자료", color: "hsl(25,50%,45%)", bgColor: "hsl(25,50%,93%)" },
  { id: "notice", name: "공지/알림", color: "hsl(175,60%,42%)", bgColor: "hsl(175,60%,93%)" },
];

export const sampleTools: Tool[] = [
  {
    id: "1",
    name: "한글 따라쓰기",
    description: "한글 자모음을 따라 쓰며 글자를 익히는 학습 도구",
    categoryId: "korean",
    targetLevel: ["초등"],
    url: "https://example.com/hangul",
  },
  {
    id: "2",
    name: "수 세기 놀이터",
    description: "그림과 함께 수 개념을 익히는 인터랙티브 학습 앱",
    categoryId: "math",
    targetLevel: ["초등", "중등"],
    url: "https://example.com/counting",
  },
  {
    id: "3",
    name: "우리 동네 탐험",
    description: "지역사회 시설과 역할을 알아보는 가상 체험 도구",
    categoryId: "social",
    targetLevel: ["초등", "중등"],
    url: "https://example.com/community",
  },
  {
    id: "4",
    name: "자연 관찰 일기",
    description: "계절 변화와 동식물을 관찰하고 기록하는 디지털 일기장",
    categoryId: "science",
    targetLevel: ["초등"],
    url: "https://example.com/nature",
  },
  {
    id: "5",
    name: "리듬 악기 연주",
    description: "다양한 타악기를 터치하며 리듬을 배우는 음악 앱",
    categoryId: "music",
    targetLevel: ["초등", "중등", "고등"],
    url: "https://example.com/rhythm",
  },
  {
    id: "6",
    name: "직업 체험 VR",
    description: "다양한 직업 환경을 가상현실로 체험하는 진로 탐색 도구",
    categoryId: "career",
    targetLevel: ["중등", "고등", "전공과"],
    url: "https://example.com/career-vr",
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
