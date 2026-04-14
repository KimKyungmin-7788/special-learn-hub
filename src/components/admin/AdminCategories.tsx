import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, ChevronDown, FolderOpen, RefreshCw } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

// --- HSL <-> Hex ---
function hslStringToHex(hsl: string): string {
  const m = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!m) return "#888888";
  let h = parseInt(m[1]) / 360, s = parseInt(m[2]) / 100, l = parseInt(m[3]) / 100;
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const f = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1/6) return p + (q-p)*6*t; if (t < 1/2) return q; if (t < 2/3) return p + (q-p)*(2/3-t)*6; return p; };
    const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    r = f(p,q,h+1/3); g = f(p,q,h); b = f(p,q,h-1/3);
  }
  const x = (v: number) => Math.round(v*255).toString(16).padStart(2,"0");
  return `#${x(r)}${x(g)}${x(b)}`;
}
function hexToHsl(hex: string) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b); let h=0,s:number; const l=(max+min)/2;
  if (max===min) { h=s=0; } else { const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;} }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}
function hexToHslString(hex: string) { const {h,s,l}=hexToHsl(hex); return `hsl(${h},${s}%,${l}%)`; }
function hexToBgHslString(hex: string) { const {h,s}=hexToHsl(hex); return `hsl(${h},${s}%,93%)`; }

const ICON_OPTIONS = [
  "book", "calculator", "globe", "flask", "running", "music", "palette", "star",
  "briefcase", "home", "cog", "book-open", "bell", "chalkboard-teacher", "pen",
  "microscope", "laptop", "paint-brush", "users", "heart", "lightbulb", "graduation-cap",
  "atom", "puzzle-piece", "hands-helping", "tools", "seedling", "utensils", "folder",
  "desktop", "camera", "headphones", "gamepad", "language", "volleyball-ball",
];

// --- Color Picker ---
function ColorPickerField({ label, color, onChange }: { label: string; color: string; onChange: (hex: string) => void }) {
  const hex = color.startsWith("#") ? color : hslStringToHex(color);
  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="flex items-center gap-2 w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
            <div className="w-5 h-5 rounded border border-border shrink-0" style={{ backgroundColor: hex }} />
            <span className="text-muted-foreground">{hex}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <HexColorPicker color={hex} onChange={onChange} />
          <Input className="mt-2" value={hex} onChange={(e) => onChange(e.target.value)} maxLength={7} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ========================
// 1차 카테고리 그룹 관리
// ========================
function GroupManager({ onDirty }: { onDirty: () => void }) {
  const [form, setForm] = useState({ id: "", name: "", sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["category-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("category_groups").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { id: form.id, name: form.name, sort_order: form.sort_order };
      if (editingId) {
        if (editingId !== form.id) {
          await supabase.from("categories").update({ parent: form.id }).eq("parent", editingId);
          await supabase.from("category_groups").delete().eq("id", editingId);
          const { error } = await supabase.from("category_groups").insert(payload);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("category_groups").update(payload).eq("id", editingId);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from("category_groups").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["category-groups"] });
      toast({ title: editingId ? "수정 완료" : "추가 완료" });
      onDirty();
      reset();
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("categories").update({ parent: null }).eq("parent", id);
      const { error } = await supabase.from("category_groups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["category-groups"] });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "삭제 완료" });
      onDirty();
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const reset = () => { setForm({ id: "", name: "", sort_order: 0 }); setEditingId(null); setShowForm(false); };

  const startEdit = (g: typeof groups[0]) => {
    setForm({ id: g.id, name: g.name, sort_order: g.sort_order });
    setEditingId(g.id);
    openForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base flex items-center gap-2"><FolderOpen className="h-5 w-5" /> 1차 카테고리 (폴더)</h3>
        <Button size="sm" onClick={() => { reset(); openForm(); }}><Plus className="h-4 w-4 mr-1" /> 추가</Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">로딩 중...</p> : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">등록된 폴더가 없습니다.</p>
      ) : (
        <div className="space-y-1">
          {groups.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{g.name}</p>
                <p className="text-xs text-muted-foreground">ID: {g.id} · 순서: {g.sort_order}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => startEdit(g)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div ref={formRef} className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm">{editingId ? "폴더 수정" : "새 폴더 추가"}</h4>
          <Input placeholder="ID (영문, 예: basic)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editingId} />
          <Input placeholder="이름 (예: 기본교육과정)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div>
            <label className="text-sm text-muted-foreground">정렬 순서</label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveMutation.mutate()} disabled={!form.id || !form.name || saveMutation.isPending}>
              {saveMutation.isPending ? "저장 중..." : "저장"}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>취소</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================
// 2차 카테고리 관리
// ========================
function SubCategoryManager({ onDirty }: { onDirty: () => void }) {
  const [form, setForm] = useState({ id: "", name: "", color: "#888888", icon: "folder", parent: "none", sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: groups = [] } = useQuery({
    queryKey: ["category-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("category_groups").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const openForm = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const hslColor = form.color.startsWith("#") ? hexToHslString(form.color) : form.color;
      const hslBg = form.color.startsWith("#") ? hexToBgHslString(form.color) : form.color.replace(/\d+%\)$/, "93%)");
      const payload = { id: form.id, name: form.name, color: hslColor, bg_color: hslBg, icon: form.icon, parent: form.parent === "none" ? null : form.parent, sort_order: form.sort_order };
      if (editingId) {
        if (editingId !== form.id) {
          await supabase.from("categories").delete().eq("id", editingId);
          const { error } = await supabase.from("categories").insert(payload);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: editingId ? "수정 완료" : "추가 완료" });
      onDirty();
      reset();
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "삭제 완료" });
      onDirty();
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const reset = () => { setForm({ id: "", name: "", color: "#888888", icon: "folder", parent: "none", sort_order: 0 }); setEditingId(null); setShowForm(false); };

  const startEdit = (cat: any) => {
    setForm({ id: cat.id, name: cat.name, color: hslStringToHex(cat.color), icon: cat.icon ?? "folder", parent: cat.parent ?? "none", sort_order: cat.sort_order });
    setEditingId(cat.id);
    openForm();
  };

  const grouped = [
    ...groups.map((g) => ({ groupId: g.id, groupName: g.name, cats: categories.filter((c) => c.parent === g.id) })),
    { groupId: "none", groupName: "독립 카테고리", cats: categories.filter((c) => !c.parent) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">2차 카테고리 (과목)</h3>
        <Button size="sm" onClick={() => { reset(); openForm(); }}><Plus className="h-4 w-4 mr-1" /> 추가</Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">로딩 중...</p> : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.groupId} className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                <ChevronDown className="h-3 w-3" /> {group.groupName}
              </p>
              {group.cats.length === 0 ? (
                <p className="text-xs text-muted-foreground pl-4">항목 없음</p>
              ) : group.cats.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg ml-2">
                  <div className="w-5 h-5 rounded-full shrink-0 border border-border" style={{ backgroundColor: cat.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {cat.id} · 순서: {cat.sort_order}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div ref={formRef} className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-sm">{editingId ? "카테고리 수정" : "새 카테고리 추가"}</h4>
          <Input placeholder="ID (영문, 예: math)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editingId} />
          <Input placeholder="카테고리 이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Select value={form.parent} onValueChange={(v) => setForm({ ...form, parent: v })}>
            <SelectTrigger><SelectValue placeholder="소속 폴더 선택" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">없음 (독립)</SelectItem>
              {groups.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <ColorPickerField label="대표 색상" color={form.color} onChange={(hex) => setForm({ ...form, color: hex })} />
          <div>
            <label className="text-sm text-muted-foreground">정렬 순서</label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => saveMutation.mutate()} disabled={!form.id || !form.name || saveMutation.isPending}>
              {saveMutation.isPending ? "저장 중..." : "저장"}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>취소</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================
// Main Export
// ========================
export default function AdminCategories() {
  const [isDirty, setIsDirty] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handlePublish = () => {
    // 공개 사이트에 반영 (캐시 무효화)
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["category-groups"] });
    qc.invalidateQueries({ queryKey: ["tools"] });
    setIsDirty(false);
    toast({ title: "반영 완료", description: "변경사항이 사이트에 반영되었습니다." });
  };

  return (
    <div className="space-y-6">
      {isDirty && (
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <p className="text-sm font-medium text-foreground">변경사항이 있습니다. 사이트에 반영하려면 버튼을 눌러주세요.</p>
          <Button onClick={handlePublish} className="shrink-0">
            <RefreshCw className="h-4 w-4 mr-1" /> 사이트에 반영
          </Button>
        </div>
      )}
      <GroupManager onDirty={() => setIsDirty(true)} />
      <div className="border-t border-border" />
      <SubCategoryManager onDirty={() => setIsDirty(true)} />
    </div>
  );
}
