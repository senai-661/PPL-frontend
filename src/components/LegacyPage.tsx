import { useEffect } from "react";

type LegacyPageProps = {
  src: string;
  title?: string;
};

export default function LegacyPage({ src, title }: LegacyPageProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Openline React`;
    }
  }, [title]);

  return (
    <main className="legacy-wrapper">
      <iframe className="legacy-frame" src={src} title={title || "Openline"} />
    </main>
  );
}
