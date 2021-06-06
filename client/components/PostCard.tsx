import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post } from '../types';
import Axios from 'Axios';
import classNames from 'classnames';
import ActionButton from './ActionButtons';
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';

//convierte la hora de creación de un post en relativa (hace 2 horas)
dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post
  revalidate?: Function
}

export default function PostCard({ post }: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login');

    if(value === post.userVote) value = 0

    try {
      const res = await Axios.post('/misc/vote', {
        identifier: post.identifier,
        slug: post.slug,
        value: value,
      });

      if(post.revalidate) post.revalidate()
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={post.identifier}
      className='flex mb-4 bg-white rounded'
      id={post.identifier}
    >
      {/* Votos */}
      <div className='w-10 py-3 text-center bg-gray-200 rounded-l'>
        {/* upvote - voto positivo */}
        <div
          className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(1)}
        >
          <i
            className={classNames('fas fa-arrow-up', {
              'text-red-500': post.userVote === 1,
            })}
          ></i>
        </div>
        <p className='text-xs font-bold'>{post.voteScore}</p>
        {/* downvote - voto negativo */}
        <div
          className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(-1)}
        >
          <i
            className={classNames('fas fa-arrow-down', {
              'text-blue-600': post.userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* Post */}
      <div className='w-full p-2'>
        <div className='flex items-center'>
          <Link href={`/r/${post.subName}`}>
            <img
              src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
              className='w-6 h-6 mr-1 rounded-full cursor-pointer'
            />
          </Link>
          <Link href={`/t/${post.subName}`}>
            <a className='text-xs font-bold hover:underline'>
              /t/{post.subName}
            </a>
          </Link>
          <p className='text-xs text-gray-500'>
            <span className='mx-1'>•</span>
            Enviado por
            <Link href={`/u/${post.username}`}>
              <a className='mx-1 hover:underline'>/u/{post.username}</a>
            </Link>
            <span>•</span>
            <Link href={post.url}>
              <a className='mx-1 hover:underline'>
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={post.url}>
          <a className='my-1 text-lg font-medium'>{post.title}</a>
        </Link>
        {post.body && <p className='my-1 text-sm'>{post.body}</p>}
        <div className='flex'>
          <Link href={post.url}>
            <a>
              {/* comentarios*/}
              <ActionButton>
                <i className='mr-1 fas fa-comments fa-xs'></i>
                <span className='font-bold'>
                  {post.commentCount} comentarios
                </span>
              </ActionButton>
            </a>
          </Link>
          {/* compartir*/}
          <ActionButton>
            <i className='mr-1 fas fa-share fa-xs'></i>
            <span className='font-bold'>Compartir</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
