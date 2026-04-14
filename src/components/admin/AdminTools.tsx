import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import type { Tables } from "@/integrations/supabase/types";

const TARGET_OPTIONS = ["초등", "중등", "고등", "전공과"];

type ToolRow = Tables<"tools">;

interface ToolForm {
  name: string;
  description: string;
  url: string;
  thumbnail_url: string;
  category_id: string;
  targets: string[];
}

const emptyForm: ToolForm = {
  name: "",
  description: "",
  url: "",
  thumbnail_url: "",
  category_id: "",
  targets: [],
};

export default function AdminTools() {
  const [form, setForm] = useState<ToolForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: categories = [] } = useCategories();

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["admin-tools"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tools").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as ToolRow[];
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "이미지 파일만 업로드 가능합니다.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(fileName);

      setForm((f) => ({ ...f, thumbnail_url: urlData.publicUrl }));
      toast({ title: "이미지 업로드 완료" });
    } catch (err: any) {
      toast({ title: "업로드 실패", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("tools").update(form).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tools").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tools"] });
      qc.invalidateQueries({ queryKey: ["tools"] });
      toast({ title: editingId ? "수정 완료" : "추가 완료" });
      resetForm();
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tools"] });
      qc.invalidateQueries({ queryKey: ["tools"] });
      toast({ title: "삭제 완료" });
    },
    onError: (e: Error) => toast({ title: "오류", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (tool: ToolRow) => {
    setForm({
      name: tool.name,
      description: tool.description,
      url: tool.url,
      thumbnail_url: tool.thumbnail_url ?? "",
      category_id: tool.category_id,
      targets: tool.targets,
    });
    setEditingId(tool.id);
    setShowForm(true);
  };

  const toggleTarget = (t: string) => {
    setForm((f) => ({
      ...f,
      targets: f.targets.includes(t) ? f.targets.filter((x) => x !== t) : [...f.targets, t],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">에듀테크 도구 목록</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> 도구 추가
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">{editingId ? "도구 수정" : "새 도구 추가"}</h3>
          <Input placeholder="도구 이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea placeholder="설명" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />

          {/* 썸네일 업로드 영역 */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">썸네일 이미지</p>
            <div className="flex gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-1" />
                {uploading ? "업로드 중..." : "이미지 업로드"}
              </Button>
              <span className="text-xs text-muted-foreground">또는</span>
              <Input
                placeholder="썸네일 URL 직접 입력"
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                className="flex-1"
              />
            </div>
            {form.thumbnail_url && (
              <div className="relative inline-block">
                <img
                  src={form.thumbnail_url}
                  alt="썸네일 미리보기"
                  className="h-20 w-20 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5"
                  onClick={() => setForm({ ...form, thumbnail_url: "" })}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
            <SelectTrigger><SelectValue placeholder="카테고리 선택" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <p className="text-sm text-muted-foreground mb-2">대상 선택</p>
            <div className="flex gap-2 flex-wrap">
              {TARGET_OPTIONS.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={form.targets.includes(t) ? "default" : "outline"}
                  onClick={() => toggleTarget(t)}
                  type="button"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={!form.name || !form.category_id || saveMutation.isPending}>
              {saveMutation.isPending ? "저장 중..." : "저장"}
            </Button>
            <Button variant="outline" onClick={resetForm}>취소</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : tools.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">등록된 도구가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {tools.map((tool) => (
            <div key={tool.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              {tool.thumbnail_url && (
                <img src={tool.thumbnail_url} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{tool.name}</p>
                <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{tool.category_id}</span>
              <Button variant="ghost" size="icon" onClick={() => startEdit(tool)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(tool.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}