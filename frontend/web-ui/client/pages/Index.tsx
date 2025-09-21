import { useEffect, useMemo, useRef, useState } from "react";

type Agent = {
  id: string;
  icon: string;
  name: string;
  price_sol: number;
  category: string;
  description: string;
};

type WorkflowResponse = {
  results: Record<string, unknown>;
  total_cost_sol: number;
  total_cost_usd: number;
};

function HeaderAuth() {
  const [enabled, setEnabled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const c = await fetch("/api/auth/config").then((r) => r.json());
        setEnabled(Boolean(c.googleEnabled));
      } catch {}
      try {
        const u = await fetch("/api/auth/user").then((r) => r.json());
        setUser(u.user ?? null);
      } catch {}
    })();
  }, []);

  const login = () => {
    if (!enabled) return;
    location.href = "/api/auth/google";
  };
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.reload();
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photo ? (
          <img src={user.photo} alt={user.displayName} className="w-8 h-8 rounded-full border border-black/20" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center text-sm">
            {String(user.displayName || "").charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:block font-code text-sm text-foreground/80">{user.email || user.displayName}</span>
        <button onClick={logout} className="font-code text-sm px-3 py-2 rounded-xl border-2 border-black/80 bg-white hover:-translate-y-0.5 transition">
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      disabled={!enabled}
      className={`font-code text-sm px-4 py-2 rounded-xl border-2 transition ${
        enabled ? "border-black/80 bg-white hover:-translate-y-0.5" : "border-black/20 bg-white/60 cursor-not-allowed"
      }`}
      title={enabled ? "Continue with Google" : "Google login not configured"}
    >
      Continue with Google
    </button>
  );
}

export default function Index() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [running, setRunning] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [live, setLive] = useState<string[]>([]);
  const solToUsd = 180;

  const wsRef = useRef<WebSocket | null>(null);
  const updatesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/agents");
        const data = await res.json();
        setAgents(data.agents as Agent[]);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${location.host}/ws/updates`);
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      setLive((prev) => [...prev, String(ev.data)]);
    };
    ws.onerror = () => setLive((p) => [...p, "❌ WebSocket error"]);
    ws.onclose = () => setLive((p) => [...p, "⚠️ Disconnected from live updates"]);
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!updatesRef.current) return;
    updatesRef.current.scrollTop = updatesRef.current.scrollHeight;
  }, [live]);

  const totalSOL = useMemo(
    () =>
      agents
        .filter((a) => selected.includes(a.id))
        .reduce((sum, a) => sum + a.price_sol, 0),
    [agents, selected],
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const canRun = query.trim().length > 0 && selected.length > 0 && !running;

  const run = async () => {
    if (!canRun) return;
    setRunning(true);
    setStatusMsg("⏳ Processing workflow...");
    setWorkflow(null);
    try {
      const res = await fetch("/api/workflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, selected_agents: selected, user_wallet: "demo_wallet" }),
      });
      const data = (await res.json()) as WorkflowResponse;
      setWorkflow(data);
      setStatusMsg("✅ Workflow completed!");
    } catch (e) {
      setStatusMsg("❌ Workflow failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-8 md:py-12 relative overflow-hidden">
      {/* Hero glow */}
      <div className="pointer-events-none absolute -top-40 right-1/2 translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,_rgba(34,211,238,0.22),_transparent)]" />

      <div className="w-full max-w-7xl grid grid-cols-1 gap-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">Agent Marketplace</span>
          </div>
          <HeaderAuth />
        </header>

        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Compose, rent, and run AI agents for your workflows
          </h1>
          <p className="font-code mt-4 text-base md:text-lg text-foreground/80">
            Your marketplace for specialized agents. Spin up automations, orchestrate tasks, and ship faster.
          </p>
        </section>

        {/* Agent tiles */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.slice(0, 4).map((a, i) => (
              <div
                key={a.id}
                className="group relative overflow-hidden rounded-[3.125rem] p-6 shadow border-2 border-black/10 transition-all duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  background:
                    i === 0
                      ? "#7DD3FC"
                      : i === 1
                      ? "#FDE68A"
                      : i === 2
                      ? "#7C3AED"
                      : "#0F172A",
                  color: i >= 2 ? "#F8FAFC" : "#111827",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(255,255,255,0.25), transparent)" }}
                />
                <div className="flex items-center justify-between font-bold">
                  <div className="font-display text-2xl">{a.icon} {a.name.split(" ")[0]}</div>
                  <div className="font-code">{a.price_sol.toFixed(3)} SOL</div>
                </div>
                <div className="font-code opacity-80 mt-1 text-sm">{a.category}</div>
                <div className="mt-3 text-sm leading-snug max-w-md">{a.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Creator + Results */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="rounded-2xl p-5 shadow border-2 border-black/10 bg-card">
            <h2 className="font-display text-xl mb-4">📊 Workflow Results</h2>
            <div>
              {!workflow ? (
                <pre className="bg-black/5 p-3 rounded-lg text-sm opacity-80">No workflow run yet.</pre>
              ) : (
                <div className="space-y-3">
                  {Object.entries(workflow.results).map(([agent, output]) => (
                    <div key={agent} className="opacity-0 translate-y-2 animate-fadeIn rounded-xl p-4 bg-white border border-black/10">
                      <div className="font-code font-semibold mb-2">{agent} Results</div>
                      <pre className="bg-black/5 p-3 rounded-lg text-xs overflow-auto max-h-64">{JSON.stringify(output, null, 2)}</pre>
                    </div>
                  ))}
                  <div className="opacity-0 translate-y-2 animate-fadeIn rounded-xl p-4 bg-white border border-black/10">
                    <div className="font-code font-semibold mb-2">💰 Summary</div>
                    <p>Total Cost: {workflow.total_cost_sol.toFixed(3)} SOL</p>
                    <p>USD Value: ${workflow.total_cost_usd.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl p-5 shadow border-2 border-black/10 bg-card">
            <h2 className="font-display text-xl mb-4">⚡ Create Workflow</h2>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your project..."
              className="w-full mb-3 px-3 py-3 rounded-xl border-2 border-black/20 bg-white placeholder-black/50 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <p className="font-code font-medium mb-2">Select Agents:</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {agents.filter((a) => a.id !== "analyst").map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-code ${
                    selected.includes(a.id)
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-black/20 hover:border-black/40"
                  }`}
                >
                  {a.icon} {a.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <p className="mt-1 font-code">Selected: <span className="font-semibold">{selected.length}</span> | Cost: <span className="font-semibold">{totalSOL.toFixed(3)} SOL</span> (<span className="font-semibold">${(totalSOL * solToUsd).toFixed(2)}</span>)</p>
            <button
              onClick={run}
              disabled={!canRun}
              className={`w-full mt-3 px-4 py-3 rounded-xl font-code font-semibold transition border-2 ${
                canRun ? "bg-white border-black/80 hover:-translate-y-0.5" : "bg-white/70 border-black/20 cursor-not-allowed"
              }`}
            >
              {running ? (
                <span className="inline-flex items-center gap-2">
                  Executing...
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                </span>
              ) : (
                "Execute Workflow"
              )}
            </button>
            <div className="mt-3 text-sm">
              {statusMsg && (
                <div className="px-3 py-2 rounded-lg bg-white border border-black/10 inline-flex items-center gap-2 font-code">
                  {statusMsg}
                  {statusMsg.includes("completed") && <span className="text-green-600">✔</span>}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Live updates */}
        <section className="rounded-2xl p-5 shadow border-2 border-black/10 bg-card">
          <h2 className="font-display text-xl mb-4">📡 Live Updates</h2>
          <div ref={updatesRef} className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {live.map((msg, idx) => (
              <div key={idx} className="px-3 py-2 rounded-lg bg-white border border-black/10 text-sm font-code">{msg}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
