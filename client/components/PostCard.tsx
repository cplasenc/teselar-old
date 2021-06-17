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
  post: Post;
  revalidate?: Function;
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const isInSubPage = router.pathname === '/t/[sub]'; // /t/[sub]

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login');

    if (value === userVote) value = 0;

    try {
      const res = await Axios.post('/misc/vote', {
        identifier: identifier,
        slug: slug,
        value: value,
      });

      if (revalidate) revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={identifier}
      className='flex mb-4 bg-white rounded'
      id={identifier}
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
              'text-red-500': userVote === 1,
            })}
          ></i>
        </div>
        <p className='text-xs font-bold'>{voteScore}</p>
        {/* downvote - voto negativo */}
        <div
          className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
          onClick={() => vote(-1)}
        >
          <i
            className={classNames('fas fa-arrow-down', {
              'text-blue-600': userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* Post */}
      <div className='w-full p-2'>
        <div className='flex items-center'>
          {!isInSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                <img
                  src={sub.imageUrl}
                  className='w-6 h-6 mr-1 rounded-full cursor-pointer'
                />
              </Link>
              <Link href={`/t/${subName}`}>
                <a className='text-xs font-bold hover:underline'>
                  /t/{subName}
                </a>
              </Link>
              <span className='mx-1 text-xs text-gray-500'>•</span>
            </>
          )}
          <p className='text-xs text-gray-500'>
            Enviado por
            <Link href={`/u/${username}`}>
              <a className='mx-1 hover:underline'>/u/{username}</a>
            </Link>
            <span>•</span>
            <Link href={url}>
              <a className='mx-1 hover:underline'>
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className='my-1 text-lg font-medium'>{title}</a>
        </Link>
        {body && <p className='my-1 text-sm'>{body}</p>}
        <div className='flex'>
          <Link href={url}>
            <a>
              {/* comentarios*/}
              <ActionButton>
                <i className='mr-1 fas fa-comments fa-xs'></i>
                <span className='font-bold'>{commentCount} comentarios</span>
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
