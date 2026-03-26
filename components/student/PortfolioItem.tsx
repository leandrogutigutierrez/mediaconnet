'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Play, Link as LinkIcon, FileImage } from 'lucide-react';
import type { PortfolioItem as PortfolioItemType } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { truncate } from '@/lib/utils';

interface PortfolioItemProps {
  item:      PortfolioItemType;
  editable?: boolean;
  onDelete?: (id: string) => void;
}

const typeIcons = {
  image: <FileImage size={14} />,
  video: <Play       size={14} />,
  link:  <LinkIcon   size={14} />,
};

export function PortfolioItemCard({ item, editable, onDelete }: PortfolioItemProps) {
  const [preview, setPreview] = useState(false);

  return (
    <>
      <div
        className="group relative bg-slate-100 rounded-xl overflow-hidden cursor-pointer aspect-video"
        onClick={() => setPreview(true)}
      >
        {/* Thumbnail / placeholder */}
        {item.thumbnail || item.mediaType === 'image' ? (
          <Image
            src={item.thumbnail ?? item.url}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
            <span className="text-slate-400 text-4xl">{typeIcons[item.mediaType]}</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Title on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
          <p className="text-white text-sm font-medium truncate">{item.title}</p>
        </div>

        {/* Type badge */}
        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 text-white rounded-md text-xs">
          {typeIcons[item.mediaType]}
          {item.mediaType}
        </span>

        {/* Delete button */}
        {editable && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(item._id); }}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Preview modal */}
      <Modal open={preview} onClose={() => setPreview(false)} title={item.title} size="xl">
        <div className="space-y-4">
          {item.mediaType === 'image' && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100">
              <Image src={item.url} alt={item.title} fill className="object-contain" />
            </div>
          )}
          {item.mediaType === 'video' && (
            <video src={item.url} controls className="w-full rounded-lg" />
          )}
          {item.mediaType === 'link' && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-600 hover:underline text-sm"
            >
              <LinkIcon size={15} /> {item.url}
            </a>
          )}
          {item.description && (
            <p className="text-sm text-slate-600">{item.description}</p>
          )}
        </div>
      </Modal>
    </>
  );
}
