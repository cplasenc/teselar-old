import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Post } from '../types';
import Axios from 'Axios';
import classNames from 'classnames';

//convierte la hora de creación de un post en relativa (hace 2 horas)
dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
    return <div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>{children}</div>
}

interface PostCardProps {
    post: Post
}

export default function PostCard({ post }: PostCardProps) {

  const vote = async (value) => {
    try {
      const res = await Axios.post('/misc/vote', {
        identifier: post.identifier,
        slug: post.slug,
        value: value
      })
    } catch (err) {
      console.log(err)
    }
  }

    return (
        <div key={post.identifier} className='flex mb-4 bg-white rounded'>
        {/* Votos */}
        <div className='w-10 py-3 text-center bg-gray-200 rounded-l'>
          {/* upvote - voto positivo */}
          <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={() => vote(1)}>
            <i className={classNames('fas fa-arrow-up', {
              'text-red-500': post.userVote === 1
            })}></i>
          </div>
          <p className='text-xs font-bold'>{post.voteScore}</p>
          {/* downvote - voto negativo */}
          <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={() => vote(-1)}>
          <i className={classNames('fas fa-arrow-down', {
              'text-blue-600': post.userVote === -1
            })}></i>
          </div>

.
        </div>
        {/* Post */}
        <div className='w-full p-2'>
          <div className='flex items-center'>
            <Link href={`/r/${post.subName}`}>
              <img
                src='#'
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
                  <span className='font-bold'>{post.commentCount} comentarios</span>
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
    )
}