import { useState, useEffect } from "react";

const TEAM = [
  { id: "peter", kr: "베드로", role: "정부정책 브리핑", emoji: "📋", status: "working", color: "#E74C3C" },
  { id: "andrew", kr: "안드레", role: "시장/산업 트렌드", emoji: "📊", status: "idle", color: "#3498DB" },
  { id: "james", kr: "야고보", role: "재무/회계 분석", emoji: "💰", status: "idle", color: "#2ECC71" },
  { id: "john", kr: "요한", role: "콘텐츠 기획", emoji: "✍️", status: "idle", color: "#9B59B6" },
  { id: "philip", kr: "빌립", role: "마케팅/브랜딩", emoji: "📢", status: "idle", color: "#F39C12" },
  { id: "bart", kr: "바돌로매", role: "데이터 분석", emoji: "📈", status: "working", color: "#1ABC9C" },
  { id: "matthew", kr: "마태", role: "사업계획", emoji: "🗂️", status: "idle", color: "#E67E22" },
  { id: "thomas", kr: "도마", role: "QA/리스크", emoji: "🔍", status: "idle", color: "#95A5A6" },
  { id: "jamesL", kr: "작은야고보", role: "법률/규제", emoji: "⚖️", status: "idle", color: "#34495E" },
  { id: "thad", kr: "다대오", role: "고객관리", emoji: "🤝", status: "idle", color: "#E91E63" },
  { id: "simon", kr: "시몬", role: "경쟁사 분석", emoji: "🎯", status: "idle", color: "#FF5722" },
  { id: "matt2", kr: "맛디아", role: "자동화", emoji: "⚙️", status: "working", color: "#607D8B" },
];

const POLICIES = [
  { cat: "🚀 창업지원", title: "2025년 예비창업패키지 창업기업 모집", imp: "high", deadline: "2025-04-15", amount: "최대 1억원", link: "https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do" },
  { cat: "🏢 중소기업", title: "중소기업 디지털 전환 지원사업 모집 공고", imp: "high", deadline: "2025-03-30", amount: "최대 1억원", link: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do" },
  { cat: "💼 일자리", title: "국민취업지원제도 참여자 모집", imp: "high", deadline: "2025-03-20", amount: "월 50만원", link: "https://www.kua.go.kr/uaptm010/selectMain.do" },
  { cat: "💼 고용", title: "청년일자리도약장려금 사업주 모집", imp: "medium", amount: "최대 720만원", link: "https://www.work.go.kr/youthjob/main/index.do" },
  { cat: "🏢 소상공인", title: "소상공인 경영안정자금 추가 모집", imp: "medium", amount: "최대 5천만원", link: "https://ols.semas.or.kr/ols/man/info/newPolicyGuide.do" },
  { cat: "🚀 창업지원", title: "초기창업패키지 추가모집 안내", imp: "high", deadline: "2025-04-01", amount: "최대 1억원", link: "https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do" },
];

const ACTIONS = [
  { text: "예비창업패키지 서류 준비 (마감 D-52)", urgent: true },
  { text: "디지털 전환 지원사업 신청 자격 확인 (마감 D-36)", urgent: true },
  { text: "국민취업지원제도 온라인 신청 (마감 D-26)", urgent: false },
];

const LOGS = [
  { time: "08:00", who: "베드로", msg: "아침 브리핑 생성 완료", t: "ok" },
  { time: "08:05", who: "바돌로매", msg: "대시보드 데이터 업데이트", t: "info" },
  { time: "08:10", who: "맛디아", msg: "정기 크롤링 스케줄 실행", t: "info" },
  { time: "09:00", who: "Jason", msg: "결정 요청: 예비창업패키지 분야 선택", t: "warn" },
  { time: "09:15", who: "안드레", msg: "AI 산업 트렌드 리포트 작성 시작", t: "info" },
  { time: "09:30", who: "Jason", msg: "종합 보고서 업데이트 완료", t: "ok" },
];

const DECISIONS = [
  { id: "1", title: "예비창업패키지 지원 분야 선택", desc: "AI·디지털 분야 vs 그린·ESG 분야 중 선택 필요", rec: "AI·디지털 분야", reason: "시장 성장률 23% 및 정부 투자 확대 기조 고려 시 AI·디지털 분야가 선정 확률과 성장 잠재력 모두 유리" },
  { id: "2", title: "Q1 마케팅 예산 배분 조정", desc: "온라인 70% vs 오프라인 30% 비율 조정 필요", rec: "온라인 80% / 오프라인 20%", reason: "바돌로매의 데이터 분석 결과 디지털 채널 ROI가 오프라인 대비 3.2배 높음" },
];

const card = {
  padding: 20, borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
};

export default function App() {
  const [tab, setTab] = useState("overview");
  const [selMember, setSelMember] = useState(null);
  const [time, setTime] = useState(new Date());
  const [decided, setDecided] = useState({});

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tStr = time.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dStr = time.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
  const pendingCount = DECISIONS.filter(d => !decided[d.id]).length;

  const tabs = [
    { id: "overview", label: "📊 종합 현황" },
    { id: "briefing", label: "📋 아침 브리핑" },
    { id: "team", label: "👥 팀원 현황" },
    { id: "decisions", label: "🔔 결정 대기" },
  ];

  return (
    <div style={{ fontFamily: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif", background: "#0B0F1A", color: "#E8ECF4", minHeight: "100vh" }}>
      {/* Header */}
      <div className="header-container" style={{ background: "linear-gradient(135deg, #0D1321 0%, #1B2838 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>🎼</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, background: "linear-gradient(135deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MCP Orchestra</div>
            <div style={{ fontSize: 10, color: "#64748B", letterSpacing: 1 }}>TEAM DASHBOARD</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{dStr}</div>
            <div style={{ fontSize: 18, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{tStr}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>J</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#0D1321", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "0 24px", display: "flex", gap: 2, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "12px 16px", fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? "#F1F5F9" : "#64748B",
            background: tab === t.id ? "rgba(59,130,246,0.1)" : "transparent",
            border: "none", borderBottom: tab === t.id ? "2px solid #3B82F6" : "2px solid transparent",
            cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {t.label}
            {t.id === "decisions" && pendingCount > 0 && (
              <span style={{ marginLeft: 6, background: "#EF4444", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 8, fontWeight: 700 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (
          <div>
            {/* Stat Cards */}
            <div className="grid-stats" style={{ marginBottom: 16 }}>
              {[
                { icon: "📋", label: "오늘 수집 정책", val: "24건", sub: "고중요도 5건", c: "#3B82F6" },
                { icon: "⏳", label: "진행중 작업", val: "3건", sub: "12명 중 3명 활동", c: "#10B981" },
                { icon: "🔔", label: "결정 대기", val: `${pendingCount}건`, sub: "즉시 확인 필요", c: "#F59E0B" },
                { icon: "✅", label: "이번주 완료", val: "18건", sub: "+23% vs 지난주", c: "#8B5CF6" },
              ].map((s, i) => (
                <div key={i} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 700 }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: s.c, marginTop: 4 }}>{s.sub}</div>
                    </div>
                    <span style={{ fontSize: 26, opacity: 0.6 }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid-summary" style={{ marginBottom: 16 }}>
              {/* Jason Summary */}
              <div style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>J</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Jason의 종합 보고</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>오늘 오전 9:30 업데이트</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.8, color: "#CBD5E1" }}>
                  오늘 베드로가 수집한 24건의 정책 중 <span style={{ color: "#F59E0B", fontWeight: 600 }}>5건이 높은 중요도</span>입니다.
                  특히 <span style={{ color: "#60A5FA", fontWeight: 600 }}>예비창업패키지</span>와
                  <span style={{ color: "#60A5FA", fontWeight: 600 }}> 디지털 전환 지원사업</span>은 마감이 임박하여 즉시 검토가 필요합니다.
                  <br /><br />
                  현재 바돌로매가 데이터 대시보드를 업데이트 중이며, 맛디아가 자동 크롤링 스케줄을 점검하고 있습니다.
                  <span style={{ color: "#F59E0B", fontWeight: 600 }}> {pendingCount}건의 결정이 대기 중</span>이니 확인 부탁드립니다.
                </div>
              </div>

              {/* Activity */}
              <div style={card}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>📡 실시간 활동</div>
                {LOGS.map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < LOGS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <span style={{ fontSize: 11, color: "#64748B", fontVariantNumeric: "tabular-nums", minWidth: 40 }}>{l.time}</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: l.t === "ok" ? "#10B981" : l.t === "warn" ? "#F59E0B" : "#3B82F6" }} />
                    <span style={{ fontSize: 12 }}>
                      <strong style={{ color: "#F1F5F9" }}>{l.who}</strong>
                      <span style={{ color: "#94A3B8" }}> — {l.msg}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Mini */}
            <div style={card}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>👥 팀 현황</div>
              <div className="grid-team-mini">
                {TEAM.map(m => (
                  <div key={m.id} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{m.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{m.kr}</div>
                    <div style={{ fontSize: 10, color: "#64748B", marginBottom: 6 }}>{m.role}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.status === "working" ? "#34D399" : "#94A3B8" }} />
                      <span style={{ fontSize: 10, color: m.status === "working" ? "#34D399" : "#94A3B8" }}>
                        {m.status === "working" ? "작업중" : "대기"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== BRIEFING ===== */}
        {tab === "briefing" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 26 }}>📋</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>베드로의 아침 브리핑</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{dStr} · 오전 8:00 자동 생성</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid-stats" style={{ gap: 10, marginBottom: 16 }}>
              {[
                { l: "총 수집", v: "24건", c: "#3B82F6" },
                { l: "고중요도", v: "5건", c: "#EF4444" },
                { l: "중간", v: "12건", c: "#F59E0B" },
                { l: "일반", v: "7건", c: "#10B981" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: s.c + "10", border: "1px solid " + s.c + "25" }}>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>{s.l}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>

            <div className="grid-briefing-layout">
              {/* Policies */}
              <div style={card}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>🔴 주요 정책</div>
                {POLICIES.map((p, i) => (
                  <div key={i} style={{
                    padding: 14, borderRadius: 10, marginBottom: 8,
                    background: p.imp === "high" ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
                    border: p.imp === "high" ? "1px solid rgba(239,68,68,0.12)" : "1px solid rgba(255,255,255,0.04)",
                    cursor: p.link ? "pointer" : "default"
                  }} onClick={() => p.link && window.open(p.link, "_blank")}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <span style={{ fontSize: 11, color: "#64748B" }}>{p.cat}</span>
                        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>
                          {p.link ? (
                            <span style={{ color: "#E8ECF4", textDecoration: "underline", textUnderlineOffset: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              {p.title} <span style={{ fontSize: 11, opacity: 0.8 }}>🔗</span>
                            </span>
                          ) : (
                            p.title
                          )}
                        </div>
                      </div>
                      {p.imp === "high" && (
                        <span style={{ background: "#EF4444", color: "#fff", fontSize: 9, padding: "2px 7px", borderRadius: 5, fontWeight: 700, flexShrink: 0 }}>중요</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
                      {p.amount && <span>💰 {p.amount}</span>}
                      {p.deadline && <span>⏰ 마감: {p.deadline}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div>
                <div style={card}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>⚡ 액션 아이템</div>
                  {ACTIONS.map((a, i) => (
                    <div key={i} style={{
                      padding: "10px 12px", borderRadius: 8, fontSize: 12, marginBottom: 8,
                      background: a.urgent ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.02)",
                      border: a.urgent ? "1px solid rgba(239,68,68,0.1)" : "1px solid rgba(255,255,255,0.04)",
                      color: a.urgent ? "#FCA5A5" : "#CBD5E1",
                    }}>
                      {a.urgent && <span>🚨 </span>}{a.text}
                    </div>
                  ))}
                </div>

                <div style={{ ...card, marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#60A5FA", marginBottom: 6 }}>💡 베드로의 팁</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.7 }}>
                    예비창업패키지는 경쟁률이 높으므로 사업계획서를 마태에게 미리 검토 요청하세요.
                    작은 야고보에게 법률 검토도 병행하면 좋습니다.
                    시몬의 경쟁사 분석도 참고하시면 차별화 포인트를 잡을 수 있습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== TEAM ===== */}
        {tab === "team" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👥 팀원 상세 현황</div>
            <div className="grid-team-full">
              {TEAM.map(m => {
                const isSel = selMember === m.id;
                return (
                  <div key={m.id} onClick={() => setSelMember(isSel ? null : m.id)} style={{
                    ...card, cursor: "pointer",
                    border: isSel ? ("2px solid " + m.color) : "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: m.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{m.kr}</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>{m.id}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>{m.role}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.status === "working" ? "#34D399" : "#94A3B8" }} />
                      <span style={{ fontSize: 11, color: m.status === "working" ? "#34D399" : "#94A3B8" }}>
                        {m.status === "working" ? "작업중" : "대기중"}
                      </span>
                    </div>
                    {isSel && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>MCP Tools:</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {["analyze", "report", "search", "alert"].map(t => (
                            <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: m.color + "15", color: m.color, border: "1px solid " + m.color + "30" }}>
                              {m.id}_{t}
                            </span>
                          ))}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#CBD5E1", marginTop: 10, marginBottom: 6 }}>시너지 연결:</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {TEAM.filter((_, idx) => idx !== TEAM.findIndex(x => x.id === m.id)).slice(0, 3).map(s => (
                            <span key={s.id} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)" }}>
                              {s.emoji} {s.kr}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== DECISIONS ===== */}
        {tab === "decisions" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔔 결정 대기 항목</div>
            {DECISIONS.map(d => (
              <div key={d.id} style={{ ...card, marginBottom: 14, border: decided[d.id] ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(245,158,11,0.15)" }}>
                {decided[d.id] ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>✅</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{d.title}</div>
                      <div style={{ fontSize: 13, color: "#34D399", marginTop: 4 }}>결정 완료: {decided[d.id]}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ background: "#F59E0B", color: "#000", fontSize: 10, padding: "2px 7px", borderRadius: 5, fontWeight: 700 }}>결정 필요</span>
                      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>{d.title}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{d.desc}</div>
                    </div>

                    <div style={{ padding: 14, borderRadius: 8, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)", marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#60A5FA", marginBottom: 4 }}>🎯 Jason의 추천</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{d.rec}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{d.reason}</div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => setDecided(prev => ({ ...prev, [d.id]: d.rec }))} style={{
                        padding: "9px 20px", borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #2563EB)",
                        color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>✅ 추천안 승인</button>
                      <button onClick={() => setDecided(prev => ({ ...prev, [d.id]: "수정 결정" }))} style={{
                        padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.04)",
                        color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, cursor: "pointer",
                      }}>✏️ 수정 결정</button>
                      <button onClick={() => setDecided(prev => ({ ...prev, [d.id]: "반려" }))} style={{
                        padding: "9px 20px", borderRadius: 8, background: "rgba(255,255,255,0.02)",
                        color: "#64748B", border: "1px solid rgba(255,255,255,0.06)", fontSize: 12, cursor: "pointer",
                      }}>↩️ 반려</button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {pendingCount === 0 && (
              <div style={{ ...card, textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>모든 결정이 완료되었습니다!</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Jason이 결과를 팀원들에게 전달하고 있습니다.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
