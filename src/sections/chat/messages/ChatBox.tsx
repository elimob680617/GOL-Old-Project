// import { useState, useEffect } from 'react';
import { useEffect, useRef, useState } from 'react';
import ChatList from './ChatList';
import { Box, Paper, Stack, Typography } from '@mui/material';
import ChatHeader from './ChatHeader';
import MsgInput from './MsgInput';
import { useDispatch, useSelector } from 'src/redux/store';
import UserAvatarName from './UserAvatarName';
import { useMessagesByRoomIdQuery } from 'src/_requests/graphql/chat/queries/messagesByRoomId.generated';
import { useRouter } from 'next/router';
import { onGetAllMsg, onUpdateMsg, onPaginateMsg } from 'src/redux/slices/chat/allMsgReducer';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';
import { useGetByRoomIdConversationContactQuery } from 'src/_requests/graphql/chat/queries/getByRoomIdConversationContact.generated';
import { onSelectUser } from 'src/redux/slices/chat/selectedUser';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Maybe, MessageResponseDto, Scalars } from 'src/@types/sections/serverTypes';
import useOnScreen from 'src/hooks/useIsVisiable';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

export type MessageSocket = {
  created_at?: Maybe<Scalars['DateTime']>;
  guid?: Maybe<Scalars['Guid']>;
  username?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['Guid']>;
  room_id?: Maybe<Scalars['Guid']>;
  text_content?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};
const ChatBox = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [selectedMsg, setSelectedMsg] = useState<string[]>([]);
  const { allMsgState: allMsg } = useSelector((state) => state.allMsg);
  const { onChatUser } = useSelector((state) => state.selectedUser);
  const {
    query: { id },
  } = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>();
  const onScreen: boolean = useOnScreen<any>(pageRef, pageRef.current ? `-${pageRef.current.offsetHeight}px` : '');
  const { data, isLoading, isFetching } = useMessagesByRoomIdQuery({
    filter: { pageIndex: page, dto: { roomId: id?.[0] } },
  });
  const { data: contactData, isLoading: contactLoading } = useGetByRoomIdConversationContactQuery({
    filter: { dto: { roomId: id?.[0] } },
  });

  useEffect(() => {
    if (onScreen && allMsg.length && !isFetching && boxRef) {
      boxRef.current!.scrollTop += 80;
      if (allMsg.length < count) setPage((p) => p + 1);
    }
  }, [allMsg.length, count, isFetching, onScreen]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page === 1) scrollToBottom();
  }, [page]);

  useEffect(() => {
    if (contactData) {
      dispatch(onSelectUser(contactData?.getByRoomIdConversationContact?.listDto?.items?.[0] || {}));
    }
  }, [contactData, dispatch]);
  useEffect(() => {
    if (data && !isFetching) {
      if (!page) {
        dispatch(onGetAllMsg(data?.messagesByRoomId?.listDto?.items as MessageResponseDto[]));
      } else {
        console.log(boxRef.current!.scrollTop);

        dispatch(onPaginateMsg(data?.messagesByRoomId?.listDto?.items as MessageResponseDto[]));
      }
      setCount(data?.messagesByRoomId?.listDto?.count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch, page]);

  const room = id?.[0];
  const accessToken = window.localStorage.getItem('accessToken');
  const socketUrl = `wss://f3ojsp2tsc.execute-api.us-east-1.amazonaws.com/dev?token=${accessToken}&room_id=${room}`;
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  }: { sendJsonMessage: SendJsonMessage; lastJsonMessage: MessageSocket; readyState: ReadyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log('opened'),
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
      onMessage: (e) => console.log(e),
    }
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  console.log(connectionStatus);

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.text_content) {
      const newMessage: MessageResponseDto = {
        ulId: lastJsonMessage.id,
        mine: onChatUser.userId === lastJsonMessage['user_id'],
        roomId: lastJsonMessage['room_id'],
        text: lastJsonMessage['text_content'],
        toUserId: lastJsonMessage['user_id'],
        toUserName: lastJsonMessage.username,
        id: lastJsonMessage.guid,
        createdDateTime: new Date(lastJsonMessage.created_at * 1000),
      };
      dispatch(onUpdateMsg(newMessage));
      scrollToBottom();
    }
  }, [lastJsonMessage, dispatch, onChatUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
        }}
      >
        {allMsg.length && <ChatHeader />}
        <Box sx={{ height: '70vh', overflowY: 'auto' }} ref={boxRef}>
          <div ref={pageRef} />
          {!isLoading && isFetching && <LoadingCircular />}
          {isLoading ? (
            <LoadingCircular />
          ) : allMsg.length ? (
            <>
              {allMsg
                .map((item, index, arr) => (
                  <ChatList
                    key={item.ulId}
                    chat={item}
                    list={arr}
                    index={index}
                    setSelectedMsg={setSelectedMsg}
                    selectedMsg={selectedMsg}
                  />
                ))
                .reverse()}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <>
              <UserAvatarName />
              <Stack
                sx={{
                  width: '164px',
                  height: '164px',
                  backgroundColor: ' #F4F7FB',
                  borderRadius: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  margin: '15vh 0',
                  marginLeft: 'calc(50% - 82px)',
                }}
              >
                <Typography>No Message</Typography>
              </Stack>
            </>
          )}
        </Box>
        <MsgInput sendJsonMessage={sendJsonMessage} room={room!} />
      </Paper>
    </Stack>
  );
};

export default ChatBox;
