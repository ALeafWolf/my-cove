export const publicPaths = ["/", "/login", "/post", "/not-found"];

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/post", label: "思绪" },
  { href: "/mini-blog", label: "碎碎念" },
];

export function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
