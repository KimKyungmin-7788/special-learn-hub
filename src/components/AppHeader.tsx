import { Search, Bookmark, User, Shield, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function AppHeader({ searchQuery, onSearchChange }: AppHeaderProps) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-card">
      <SidebarTrigger className="shrink-0" />

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">특</span>
        </div>
        <h1 className="text-base font-bold text-foreground whitespace-nowrap">특수교육 수업자료 센터</h1>
      </div>

      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="도구 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {isAdmin && (
        <Button variant="ghost" size="sm" className="shrink-0" onClick={() => navigate("/admin")}>
          <Shield className="h-4 w-4 mr-1" />
          관리
        </Button>
      )}

      <Button variant="ghost" size="icon" className="shrink-0">
        <Bookmark className="h-5 w-5" />
      </Button>

      {user ? (
        <Button variant="outline" size="sm" className="shrink-0" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-1" />
          로그아웃
        </Button>
      ) : (
        <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate("/login")}>
          <User className="h-4 w-4 mr-1" />
          로그인
        </Button>
      )}
    </header>
  );
}
