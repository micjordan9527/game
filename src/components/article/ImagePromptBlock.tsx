export function ImagePromptBlock({ prompt }: { prompt: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-line bg-ink p-4 text-sm leading-7 text-white">
      <code>{prompt}</code>
    </pre>
  )
}
