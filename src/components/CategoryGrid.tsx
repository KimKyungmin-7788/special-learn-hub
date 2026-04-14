import { useCategories } from "@/hooks/useCategories";
import CategoryIcon from "./CategoryIcon";

interface CategoryGridProps {
  onSelectCategory: (id: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const { data: categories = [] } = useCategories();
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground mb-4 font-heading">카테고리</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 stagger-children">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent transition-all duration-200 group hover:scale-105 active:scale-95"
          >
            <CategoryIcon categoryId={cat.id} size={56} icon={cat.icon} color={cat.color} />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight transition-colors duration-200">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
