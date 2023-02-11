import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
// import { accessTokenChanged } from 'src/redux/slices/auth';
import { useDispatch } from 'src/redux/store';

export default function NextAuthPrepare({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  // console.log('SESSION', status, session);

  const sessionAccessToken: string = (session?.accessToken || null) as string;

  useEffect(() => {
    if (status !== 'loading') {
      // dispatch(accessTokenChanged(sessionAccessToken || ''));
    }
  }, [sessionAccessToken, status, dispatch]);

  return <>{children}</>;
}
