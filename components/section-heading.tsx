type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm font-semibold tracking-[0.24em] text-amber-400 uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-stone-300">{description}</p>
    </div>
  );
}
