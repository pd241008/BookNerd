/**
 * Reader pages get a minimal layout — no navbar or padding.
 * The reader page itself handles its own chrome (toolbar, sidebar, etc.)
 */
export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
