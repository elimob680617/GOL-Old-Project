import { ReactNode } from 'react';
import HelpCenter from 'src/sections/help/HelpCenter';

const helpRoutes: Record<string, ReactNode> = {
  'help-center': <HelpCenter />,
};

export default helpRoutes;
