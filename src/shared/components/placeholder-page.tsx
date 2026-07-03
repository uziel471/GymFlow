interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="text-muted-foreground rounded-lg border border-dashed p-10 text-center text-sm">
        {description ??
          "This section is part of the base shell. Functionality coming soon."}
      </div>
    </div>
  );
}
