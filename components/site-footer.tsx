export function SiteFooter() {
  return (
    <footer className="border-t mt-12">
      <div className="container-page h-14 flex items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Prevalentware – Demo técnica</p>
        <a href="/api/docs" className="hover:text-foreground">
          API Docs
        </a>
      </div>
    </footer>
  );
}
