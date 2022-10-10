import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from './BaseQuery';

const api = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL,
    }),
    endpoints: (builder) => ({
        getChannels: builder.query({
            query: () => '/channels',
        }),
        addChannel: builder.mutation({
            query: newChannel => ({
                url: '/channels',
                method: 'POST',
                data: newChannel
            }),
        }),
        addMember: builder.mutation({
            query: (options) => ({
                url: `/channels/${options.channelId}/join`,
                method: 'POST',
            })
        }),
        leaveChannel: builder.mutation({
            query: channelId => ({
                url: `/channels/${channelId}/leave`,
                method: 'POST',
            })
        }),
        deleteChannel: builder.mutation({
            query: channelId => ({
                url: `/channels/${channelId}`,
                method: 'DELETE'
            })
        }),
        getMessages: builder.query({
            query: (options) => ({
                url: '/messages',
                params: options
            }),
        }),
        postMessage: builder.mutation({
            query: (options) => ({
                url: '/messages',
                method: 'POST',
                data: options
            })
        })
    })
});

export const {
    useGetChannelsQuery,
    useAddChannelMutation,
} = api;