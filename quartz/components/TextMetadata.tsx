import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

function TextMetadata({ fileData, displayClass }: QuartzComponentProps) {
  const fm = fileData.frontmatter ?? {}

  const fields = [
    ["Text ID", fm.textid],
    ["Date", fm.notBefore !== undefined || fm.notAfter !== undefined
      ? `${fm.notBefore ?? ""}–${fm.notAfter ?? ""}`
      : undefined],
    ["Author", fm.author],
    ["Dynasty", fm.dynasty],
  ].filter(([_, value]) => value !== undefined && value !== null && value !== "")

  if (fields.length === 0) {
    return null
  }

  return (
    <dl class={classNames(displayClass, "text-metadata")}>
      {fields.map(([label, value]) => (
        <>
          <dt>{label}</dt>
          <dd>{String(value)}</dd>
        </>
      ))}
    </dl>
  )
}

export default (() => TextMetadata) satisfies QuartzComponentConstructor
