import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byNotBeforeAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    const rawA = f1.frontmatter?.notBefore
    const rawB = f2.frontmatter?.notBefore

    const yearA =
      rawA !== undefined && rawA !== null && rawA !== ""
        ? Number(rawA)
        : Number.POSITIVE_INFINITY

    const yearB =
      rawB !== undefined && rawB !== null && rawB !== ""
        ? Number(rawB)
        : Number.POSITIVE_INFINITY

    const safeA = Number.isFinite(yearA) ? yearA : Number.POSITIVE_INFINITY
    const safeB = Number.isFinite(yearB) ? yearB : Number.POSITIVE_INFINITY

    if (safeA !== safeB) {
      return safeA - safeB
    }

    const titleA = f1.frontmatter?.title ?? f1.slug ?? ""
    const titleB = f2.frontmatter?.title ?? f2.slug ?? ""

    return titleA.localeCompare(titleB, cfg.locale, {
      numeric: true,
      sensitivity: "base",
    })
  }
}

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

function formatYearRange(frontmatter: any): string {
  const rawNotBefore = frontmatter?.notBefore
  const rawNotAfter = frontmatter?.notAfter

  const notBefore =
    rawNotBefore !== undefined && rawNotBefore !== null && rawNotBefore !== ""
      ? Number(rawNotBefore)
      : undefined

  const notAfter =
    rawNotAfter !== undefined && rawNotAfter !== null && rawNotAfter !== ""
      ? Number(rawNotAfter)
      : undefined

  if (Number.isFinite(notBefore) && Number.isFinite(notAfter)) {
    return ` (${notBefore}–${notAfter})`
  }

  if (Number.isFinite(notBefore)) {
    return ` (${notBefore}–)`
  }

  if (Number.isFinite(notAfter)) {
    return ` (–${notAfter})`
  }

  return ""
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  // const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  const sorter = sort ?? byNotBeforeAndAlphabetical(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="section-ul">
      {list.map((page) => {
        const title = page.frontmatter?.title ?? page.slug
        const textid = page.frontmatter?.textid
        const yearRange = formatYearRange(page.frontmatter)
        const tags = page.frontmatter?.tags ?? []

        return (
    <li class="section-li">
     <div class="section">
        {page.frontmatter?.textid && (
        <p class="meta">{String(page.frontmatter.textid)}</p>
        )}
        <div class="desc">
        <h3>
          <a href={resolveRelative(fileData.slug!, page.slug!)}>
          {page.frontmatter?.title ?? page.slug}
          {formatYearRange(page.frontmatter)}
          </a>
        </h3>
        </div>
     </div>
    </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`
