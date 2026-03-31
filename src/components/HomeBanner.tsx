import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    title: "2022 특수교육 교육과정 기반 에듀테크 도구 모음",
    subtitle: "특수교육 현장에서 바로 활용할 수 있는 디지털 도구를 탐색하세요.",
    bg: "hsl(215,80%,50%)",
  },
  {
    title: "새로운 도구가 매주 업데이트됩니다",
    subtitle: "교과별 맞춤 에듀테크 도구를 지속적으로 추가하고 있습니다.",
    bg: "hsl(195,80%,45%)",
  },
  {
    title: "북마크 기능으로 나만의 도구함 만들기",
    subtitle: "자주 사용하는 도구를 북마크해두고 빠르게 접근하세요.",
    bg: "hsl(230,55%,45%)",
  },
];

export default function HomeBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const b = banners[idx];

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: b.bg }}
    >
      <div className="px-8 py-10 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">{b.title}</h2>
        <p className="text-primary-foreground/80">{b.subtitle}</p>
      </div>
      <button
        onClick={() => setIdx((i) => (i - 1 + banners.length) % banners.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setIdx((i) => (i + 1) % banners.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-primary-foreground" : "bg-primary-foreground/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
