import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminTools from "@/components/admin/AdminTools";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminCategories from "@/components/admin/AdminCategories";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">관리자 권한이 필요합니다.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 flex items-center gap-3 border-b border-border px-6 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">특</span>
          </div>
          <h1 className="text-base font-bold text-foreground">관리자 페이지</h1>
        </div>
        <a href="/" className="ml-auto text-sm text-primary hover:underline">← 홈으로</a>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Tabs defaultValue="tools">
          <TabsList className="mb-6">
            <TabsTrigger value="tools">도구 관리</TabsTrigger>
            <TabsTrigger value="categories">카테고리 관리</TabsTrigger>
            <TabsTrigger value="announcements">공지 관리</TabsTrigger>
          </TabsList>
          <TabsContent value="tools">
            <AdminTools />
          </TabsContent>
          <TabsContent value="categories">
            <AdminCategories />
          </TabsContent>
          <TabsContent value="announcements">
            <AdminAnnouncements />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
