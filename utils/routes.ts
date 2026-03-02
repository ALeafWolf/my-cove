export const publicPaths = ["/", "/login", "/post"];

export interface NavLink {
  href: string;
  label: string;
  publicOnly?: boolean;
}

export const navLinks: NavLink[] = [
  { href: "/post", label: "Post" },
  { href: "/mini-blog", label: "Miniblog" },
];

export function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
