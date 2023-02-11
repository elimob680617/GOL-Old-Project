import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

const CustomLink: FC<PropsWithChildren<{ path: string }>> = ({ path, children }) => (
  <Link href={path}>
    <a>{children}</a>
  </Link>
);

export default CustomLink;
