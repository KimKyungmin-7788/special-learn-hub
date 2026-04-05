import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type AnnouncementRow = Tables<"announcements">;

interface AnnForm {
  title: string;
  content: string;
  image_url: string;
  is_active: boolean;
}

const emptyForm: AnnForm = { title: "", content: "", image_url: "", is_active: true };

export default function AdminAnnouncements() {
  const [form, setForm] = useState<AnnForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as AnnouncementRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("announcements").update(form).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("announcements").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-announcements"] });
      qc.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: editingId ? "수정 완료" : "추가 완료" });
      resetForm();
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-announcements"] });
      qc.invalidateQueries({ queryKey: ["announcements"] });
      toast({ title: "삭제 완료" });
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const startEdit = (item: AnnouncementRow) => {
    setForm({ title: item.title, content: item.content ?? "", image_url: item.image_url ?? "", is_active: item.is_active });
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">공지사항 관리</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> 공지 추가
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">{editingId ? "공지 수정" : "새 공지 추가"}</h3>
          <Input placeholder="제목" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="내용" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <Input placeholder="배너 이미지 URL (선택)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <div className="flex items-center gap-2">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <span className="text-sm text-muted-foreground">활성화</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}>
              {saveMutation.isPending ? "저장 중..." : "저장"}
            </Button>
            <Button variant="outline" onClick={resetForm}>취소</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">등록된 공지가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{item.title}</p>
                <p className="text-sm text-muted-foreground truncate">{item.content}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {item.is_active ? "활성" : "비활성"}
              </span>
              <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
