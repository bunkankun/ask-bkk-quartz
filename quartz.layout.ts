import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      HXWD : "https://hxwd.org",
      Kanripo : "https://www.kanripo.org",
      GitHub: "https://github.com/bunkankun/ask-bkk",
//      "Issues": "https://github.com/bunkankun/ask-bkk/issues",
      "This work is licensed as CC by SA" : "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TextMetadata(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),

  Component.Explorer({
  useSavedState: false,

  mapFn: (node) => {
    if (node.data && node.data.title) {
      node.displayName = node.data.title
    }
  },

  sortFn: (a, b) => {
    // files before folders
    if (!a.isFolder && b.isFolder) return -1
    if (a.isFolder && !b.isFolder) return 1

    if (a.isFolder && b.isFolder) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }

    const yearA =
      a.data && typeof a.data.notBefore === "number"
        ? a.data.notBefore
        : Number.POSITIVE_INFINITY

    const yearB =
      b.data && typeof b.data.notBefore === "number"
        ? b.data.notBefore
        : Number.POSITIVE_INFINITY

    if (yearA !== yearB) {
      return yearA - yearB
    }

    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  },
})

  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
