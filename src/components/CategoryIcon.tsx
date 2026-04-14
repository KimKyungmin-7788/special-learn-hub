import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// Register all solid icons
library.add(fas);

interface CategoryIconProps {
  categoryId: string;
  size?: number;
  icon?: string;
  color?: string;
}

export default function CategoryIcon({ size = 48, icon = "folder", color = "hsl(215,10%,55%)" }: CategoryIconProps) {
  const faSize = size < 30 ? "sm" : size < 50 ? "lg" : "xl";

  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      <FontAwesomeIcon
        icon={["fas", icon as any]}
        className="text-white"
        style={{ fontSize: size * 0.45 }}
      />
    </div>
  );
}
