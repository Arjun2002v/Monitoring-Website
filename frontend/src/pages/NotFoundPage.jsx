import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PATHS } from "../routes/paths";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 style={{ marginTop: 16, fontSize: "clamp(44px, 7vw, 80px)", letterSpacing: "-0.045em" }}>
          This page is <span className="serif-accent" style={{ color: "var(--accent)" }}>down.</span>
        </h1>
        <p style={{ marginTop: 14, color: "var(--text-muted)", fontSize: 18 }}>
          Unlike your sites, this one isn't coming back.
        </p>
        <div style={{ marginTop: 28 }}>
          <Button to={PATHS.home} variant="secondary" icon={ArrowLeft}>Back home</Button>
        </div>
      </div>
    </div>
  );
}
