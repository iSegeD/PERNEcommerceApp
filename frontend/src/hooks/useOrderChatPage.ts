import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { StreamChat, type Channel as StreamChannel } from 'stream-chat';
import { useAuth } from '@clerk/react';

import { apiFetch } from '../lib/api';

import type {
  Order,
  OrderItem,
  MeResponse,
  VideoInviteResponse,
  StreamChannelResponse,
  StreamTokenResponse,
} from '../types';

type OrderOutletContext = {
  order: Order;
  items: OrderItem[];
  paid: boolean;
};

export const useOrderChatPage = () => {
  const { id } = useParams();
  const { getToken, isSignedIn } = useAuth();
  const { paid } = useOutletContext<OrderOutletContext>();

  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<MeResponse>('/api/me', { getToken }),
    enabled: Boolean(isSignedIn),
  });

  const role = meData?.user?.role;

  const inviteMutation = useMutation({
    mutationFn: () =>
      apiFetch<VideoInviteResponse>(`/api/orders/${id}/video-invite`, {
        method: 'POST',
        getToken,
      }),
  });

  useEffect(() => {
    if (!paid || !id) return;

    let chatClient: StreamChat | null = null;

    const connectOrderChat = async () => {
      const channelData = await apiFetch<StreamChannelResponse>(
        `/api/orders/${id}/stream-channel`,
        { method: 'POST', getToken },
      );

      const token = await apiFetch<StreamTokenResponse>('/api/stream/token', {
        method: 'POST',
        getToken,
      });

      chatClient = StreamChat.getInstance(token.apiKey);

      await chatClient.connectUser(
        { id: token.userId, name: token.name },
        token.token,
      );

      const streamChannel = chatClient.channel(
        channelData.channelType,
        channelData.channelId,
      );

      await streamChannel.watch();
      setChannel(streamChannel);
      setClient(chatClient);
    };

    connectOrderChat().catch((e) => {
      setError(e instanceof Error ? e.message : 'Chat failed to load');
    });

    return () => {
      if (chatClient) {
        void chatClient.disconnectUser();
      }
    };
  }, [paid, id, getToken]);

  const canInvite = role === 'support' || role === 'admin';

  return { paid, client, error, channel, canInvite, inviteMutation };
};
