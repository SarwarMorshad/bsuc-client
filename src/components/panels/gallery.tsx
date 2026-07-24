import { MotifStrip } from "@/components/motifs/motif-strip";

const PHOTOS: { q: string; lock: number; span: string }[] = [
  { q: "bangladesh,festival", lock: 61, span: "sm:col-span-2 sm:row-span-2" },
  { q: "dhaka,people", lock: 62, span: "" },
  { q: "bangladesh,food", lock: 63, span: "" },
  { q: "bangladesh,students", lock: 64, span: "" },
  { q: "chemnitz,germany", lock: 65, span: "" },
  { q: "bangladesh,culture", lock: 66, span: "sm:col-span-2" },
  { q: "rickshaw,bangladesh", lock: 67, span: "" },
];

/** Gallery — a masonry-ish grid of community photos (placeholders for now). */
export function Gallery({ note }: { note: string }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTOS.map((p) => (
            <div
              key={p.lock}
              className={`overflow-hidden rounded-xl bg-cover bg-center shadow-sm ring-1 ring-border ${p.span}`}
              style={{
                backgroundColor: "#22335c",
                backgroundImage: `url("https://loremflickr.com/600/600/${p.q}?lock=${p.lock}")`,
              }}
              role="img"
              aria-label={p.q.replace(",", " ")}
            />
          ))}
        </div>

        <div className="mt-10">
          <MotifStrip />
          <p className="mt-6 text-center text-sm text-muted-foreground">{note}</p>
        </div>
      </div>
    </section>
  );
}
