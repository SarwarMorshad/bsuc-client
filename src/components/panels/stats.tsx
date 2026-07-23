/** Marigold band of numbers — a bright break between the darker panels. */
export function Stats({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <section className="bg-marigold py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 text-center sm:grid-cols-3">
        {items.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">
              {s.value}
            </p>
            <p className="text-sm tracking-wide text-ink/70 uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
