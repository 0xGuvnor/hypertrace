export type SiteNavLink = {
  href: string;
  label: string;
};

export const SITE_NAV_LINKS: readonly SiteNavLink[] = [
  { href: "/clusters", label: "Clusters" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/favorites", label: "Favorites" },
] as const;
