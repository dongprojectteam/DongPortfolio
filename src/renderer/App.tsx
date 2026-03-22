export const App = (): React.JSX.Element => {
  const appInfo = window.desktopApp.getAppInfo();

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Desktop Portfolio</p>
        <h1>{appInfo.name}</h1>
        <p className="description">
          Electron, TypeScript, and React structured with a strict main,
          preload, and renderer boundary.
        </p>
        <dl className="meta-grid">
          <div>
            <dt>Version</dt>
            <dd>{appInfo.version}</dd>
          </div>
          <div>
            <dt>Renderer</dt>
            <dd>React + Vite</dd>
          </div>
          <div>
            <dt>Process Split</dt>
            <dd>Main / Preload / Renderer</dd>
          </div>
        </dl>
      </section>
    </main>
  );
};
