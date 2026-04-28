import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "회원가입 실패", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "회원가입 완료", description: "이메일을 확인해주세요." });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "로그인 실패", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>

      {/* 왼쪽 소개 영역 */}
      <div style={{
        background: "linear-gradient(160deg, #5592FC 0%, #05EEA9 100%)",
        padding: "3rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "2.5rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontWeight: 500, fontSize: 14 }}>특</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
              특수교육 수업자료 센터
            </span>
          </div>

          <h1 style={{
            color: "white", fontSize: 26, fontWeight: 500,
            lineHeight: 1.4, margin: "0 0 1rem",
          }}>
            특수교사가 직접 만든<br />수업자료를 함께 나눕니다
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
            기본 교육과정을 바탕으로<br />
            개별화 수업 자료를 공유하고<br />
            함께 성장하는 공간입니다.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            "국어·수학·사회·과학 등 교과별 자료",
            "진로·직업·일상생활 자료 포함",
            "특수교사들이 직접 만든 개별화 자료",
          ].map((text) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ color: "white", fontSize: 13 }}>✓</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 로그인 영역 */}
      <div style={{
        background: "white",
        padding: "3rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.4rem" }}>
          <div style={{ width: 6, height: 24, borderRadius: 3, background: "#5592FC" }} />
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>시작하기</h2>
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 1.5rem 14px" }}>
          특수교사라면 누구나 참여할 수 있어요
        </p>

        {/* 임시: 로그인 없이 입장하기 (추후 로그인 활성화 시 제거 가능) */}
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 10,
            background: "linear-gradient(90deg, #5592FC, #05EEA9)",
            border: "none", color: "white", fontSize: 15,
            fontWeight: 600, cursor: "pointer",
            boxShadow: "0 6px 18px rgba(85, 146, 252, 0.25)",
            marginBottom: 8,
          }}
        >
          입장하기
        </button>
        <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", margin: "0 0 1.5rem" }}>
          로그인 없이 둘러보기 (베타 기간)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%", padding: "11px 16px",
              border: "0.5px solid #C2DCFF", borderRadius: 8,
              background: "#F2F7FF", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: 14, color: "#416AD7",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google 계정으로 계속하기
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
            <div style={{ flex: 1, height: "0.5px", background: "#eee" }} />
            <span style={{ fontSize: 12, color: "#aaa" }}>또는 이메일로</span>
            <div style={{ flex: 1, height: "0.5px", background: "#eee" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="email" placeholder="이메일" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              style={{
                width: "100%", padding: "10px 12px",
                border: "0.5px solid #C2DCFF", borderRadius: 8,
                fontSize: 14, boxSizing: "border-box",
              }}
            />
            <input
              type="password" placeholder="비밀번호" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={6}
              style={{
                width: "100%", padding: "10px 12px",
                border: "0.5px solid #C2DCFF", borderRadius: 8,
                fontSize: 14, boxSizing: "border-box",
              }}
            />
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "11px 16px", borderRadius: 8,
                background: "linear-gradient(90deg, #5592FC, #05EEA9)",
                border: "none", color: "white", fontSize: 14,
                fontWeight: 500, cursor: "pointer",
              }}
            >
              {loading ? "처리 중..." : isSignUp ? "회원가입" : "로그인"}
            </button>
          </form>
        </div>

        <p style={{ fontSize: 12, color: "#888", textAlign: "center", margin: 0 }}>
          {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: "#5592FC", cursor: "pointer", fontWeight: 500 }}
          >
            {isSignUp ? "로그인" : "회원가입"}
          </span>
        </p>
      </div>
    </div>
  );
}
