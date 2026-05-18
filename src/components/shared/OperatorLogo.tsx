interface Props {
  name: string;
  color?: string;
  size?: number;
}

export function OperatorLogo({ name, color = "#1e40af", size = 28 }: Props) {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className="inline-flex shrink-0 items-center justify-center rounded-md font-semibold text-white"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
