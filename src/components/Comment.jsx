import {
  useQuery,
  QueryClient,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { addComments, getComments } from '../api/commentApi';
import uuid4 from 'uuid4';
import { useParams } from 'react-router';

const Comment = () => {
  const commentRef = useRef(null);
  const queryClient = useQueryClient();
  const param = useParams();
  const pageId = param.id;

  const {
    data: comments,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['comments'],
    queryFn: getComments,
  });

  const mutationAdd = useMutation({
    mutationFn: addComments,
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });

  const handleSubmitComment = (event) => {
    event.preventDefault();
    const commentBody = commentRef.current.value;
    const newComment = {
      id: uuid4(),
      body: commentBody,
      created_at: new Date().toISOString(),
      page_id: pageId,
    };

    if (isSuccess) {
      console.log('newComment => ', newComment);
      mutationAdd.mutate(newComment);
      commentRef.current.value = '';
    }
  };

  if (isSuccess) {
    console.log('comments => ', comments);
  }

  return (
    <div className="flex flex-col bg-darkgray w-full h-[50%] rounded-2xl p-9 gap-3">
      <p className="text-xl">한 줄 응원하기</p>
      <form
        className="flex gap-3 w-full h-[10%] justify-between items-center gap-1 text-darkgray"
        onSubmit={handleSubmitComment}
      >
        <input
          type="text"
          placeholder="우리팀 화이팅!!!"
          className="p-2 rounded-md w-[100%] h-full focus:outline-none"
          ref={commentRef}
        />
        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 min-w-[110px] h-full inline-block hover:bg-[#3D69CB] hover:text-white"
        >
          작성하기
        </button>
      </form>
      <ul className="grid auto-rows-[10%] gap-1 p-3 bg-white text-darkgray h-[100%] rounded-md overflow-y-auto">
        {isPending && <div>댓글이 로딩중입니다...</div>}
        {isSuccess &&
          comments.map((comment, index) => {
            console.log(comment['page_id']);
            if (comment['page_id'] == pageId) {
              const date = comment.created_at.split('.', 1)[0].split('T', 2)[0];
              const time = comment.created_at.split('.', 1)[0].split('T', 2)[1];
              // console.log(date, time);
              return (
                <li className="flex justify-between p-2" key={index}>
                  <span>{comment.body}</span>
                  <span>{date + ' ' + time}</span>
                </li>
              );
            } else {
              return null;
            }
          })}
      </ul>
    </div>
  );
};

export default Comment;
