import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { googleSignIn } from '../api/googleSignIn';
import { ACCESS_TOKEN_KEY } from '@/lib/constants';

export function useGoogleSignIn(successMessage: string) {
  const [isPending, setIsPending] = useState(false);
  const googleClient = useRef<TokenClient | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleResponse(accessToken: string) {
      setIsPending(true);
      googleSignIn(accessToken)
        .then((data) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, String(data.token));
          toast.success(successMessage);
          navigate('/dashboard');
        })
        .catch(() => {
          toast.error('Google sign in failed');
        })
        .finally(() => {
          setIsPending(false);
        });
    }

    if (window.google?.accounts?.oauth2) {
      googleClient.current = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        callback: (response) => {
          if (response.access_token) {
            handleResponse(response.access_token);
          }
        },
        error_callback: () => {
          setIsPending(false);
          toast.error('Google sign in failed');
        },
      });
    }
  }, [successMessage, navigate]);

  function signInWithGoogle() {
    googleClient.current?.requestAccessToken();
  }

  return { signInWithGoogle, isGooglePending: isPending };
}
