import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '@clerk/react';
import { useQuery } from '@tanstack/react-query';
import { StreamVideoClient, type Call } from '@stream-io/video-react-sdk';

import { apiFetch } from '../lib/api';

import type { OrderResponse, StreamTokenResponse } from '../types';

export const useOrderVideoPage = () => {
  const { id } = useParams();
  const { getToken, isSignedIn } = useAuth();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => apiFetch<OrderResponse>(`/api/orders/${id}`, { getToken }),
    enabled: Boolean(id) && isSignedIn,
  });

  const order = data?.order;
  const paid = order?.status === 'paid';

  useEffect(() => {
    if (!paid || !id || !isSignedIn) return;

    let videoClient: StreamVideoClient | undefined;
    let activeCall: Call | undefined;

    const connectOrderVideo = async () => {
      const token = await apiFetch<StreamTokenResponse>('/api/stream/token', {
        getToken,
        method: 'POST',
      });

      videoClient = new StreamVideoClient({
        apiKey: token.apiKey,
        user: { id: token.userId, name: token.name },
        token: token.token,
      });

      activeCall = videoClient.call('default', `order-${id}`);

      await activeCall.join({ create: true });

      setClient(videoClient);
      setCall(activeCall);
    };

    void connectOrderVideo().catch((e) => {
      setError(e instanceof Error ? e.message : 'Video failed to start');
    });

    return () => {
      void activeCall?.leave().catch(() => {});
      void videoClient?.disconnectUser().catch(() => {});
    };
  }, [paid, id, getToken, isSignedIn]);

  return {
    id,
    order,
    paid,
    isLoading,
    loadError,
    client,
    call,
    error,
  };
};
