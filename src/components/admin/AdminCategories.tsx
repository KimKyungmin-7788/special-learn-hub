import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";

interface CategoryForm {
  id: string;
  name: string;
  color: string;
  bg_color: string;
  parent: string;
  sort_order: number;
}

const emptyForm: CategoryForm = {
  id: "",
  name: "",
  color: "hsl(0,0%,50%)",
  bg_color: "hsl(0,0%,95%)",
  parent: "",
  sort_order: 0,
};

const PARENT_OPTIONS = [
  { value: "", label: "없음 (독립)" },
  { value: "basic", label: "기본교육과정" },
  { value: "elective", label: "선택중심교육과정" },
];

export default function AdminCategories() {
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        id: form.id,
        name: form.name,
        color: form.color,
        bg_color: form.bg_color,
        parent: form.parent || null,
        sort_order: form.sort_order,
      };
      if (editingId) {
        // If ID changed, delete old and insert new
        if (editingId !== form.id) {
          const { error: delErr } = await supabase.from("categories").delete().eq("id", editingId);
          if (delErr) throw delErr;
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
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: editingId ? "수정 완료" : "추가 완료" });
      resetForm();
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
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "삭제 완료" });
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: typeof categories[0]) => {
    setForm({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      bg_color: cat.bg_color,
      parent: cat.parent ?? "",
      sort_order: cat.sort_order,
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const basicCats = categories.filter((c) => c.parent === "basic");
  const electiveCats = categories.filter((c) => c.parent === "elective");
  const standaloneCats = categories.filter((c) => !c.parent);

  const renderGroup = (title: string, cats: typeof categories) => (
    <div className="space-y-1">
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      {cats.map((cat) => (
        <div key={cat.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">ID: {cat.id} · 순서: {cat.sort_order}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cat.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      {cats.length === 0 && <p className="text-xs text-muted-foreground pl-2">항목 없음</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">카테고리 관리</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> 카테고리 추가
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">{editingId ? "카테고리 수정" : "새 카테고리 추가"}</h3>
          <Input placeholder="ID (영문, 예: math)" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={!!editingId} />
          <Input placeholder="카테고리 이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <Select value={form.parent || "none"} onValueChange={(v) => setForm({ ...form, parent: v === "none" ? "" : v })}>
            <SelectTrigger><SelectValue placeholder="상위 폴더 선택" /></SelectTrigger>
            <SelectContent>
              {PARENT_OPTIONS.map((o) => (
                <SelectItem key={o.value || "none"} value={o.value || "none"}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">아이콘 색상</label>
              <Input placeholder="hsl(0,75%,55%)" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">배경 색상</label>
              <Input placeholder="hsl(0,75%,95%)" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">정렬 순서</label>
            <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={!form.id || !form.name || saveMutation.isPending}>
              {saveMutation.isPending ? "저장 중..." : "저장"}
            </Button>
            <Button variant="outline" onClick={resetForm}>취소</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-6">
          {renderGroup("기본교육과정", basicCats)}
          {renderGroup("선택중심교육과정", electiveCats)}
          {renderGroup("독립 카테고리", standaloneCats)}
        </div>
      )}
    </div>
  );
}
