'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileForm } from '@/components/forms/ProfileForm';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loading';
import { Camera, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { PortfolioItemCard } from '@/components/student/PortfolioItem';
import type { PortfolioItem } from '@/types';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const { user, refresh } = useAuth();
  const fileRef           = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [portfolioModal,  setPortfolioModal]  = useState(false);
  const [portfolioForm,   setPortfolioForm]   = useState({
    title: '', description: '', mediaType: 'image', url: '',
  });
  const [addingPortfolio, setAddingPortfolio] = useState(false);

  if (!user) return <PageLoader />;

  // Upload avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      await fetch(`/api/users/${user._id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ avatar: json.data.url }),
      });
      await refresh();
      toast.success('Avatar updated!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Add portfolio item
  const handleAddPortfolio = async () => {
    if (!portfolioForm.title || !portfolioForm.url) {
      toast.error('Title and URL are required');
      return;
    }
    setAddingPortfolio(true);
    try {
      const res  = await fetch(`/api/users/${user._id}/portfolio`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(portfolioForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await refresh();
      toast.success('Portfolio item added!');
      setPortfolioModal(false);
      setPortfolioForm({ title: '', description: '', mediaType: 'image', url: '' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setAddingPortfolio(false);
    }
  };

  // Delete portfolio item
  const handleDeletePortfolio = async (itemId: string) => {
    try {
      const res = await fetch(`/api/users/${user._id}/portfolio?itemId=${itemId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      await refresh();
      toast.success('Removed');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Edit Profile</h1>

      {/* Avatar section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar src={user.avatar} name={user.name} size="xl" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              loading={uploadingAvatar}
              onClick={() => fileRef.current?.click()}
            >
              Change photo
            </Button>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-6">
        <ProfileForm />
      </div>

      {/* Portfolio section (students only) */}
      {user.role === 'student' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Portfolio</h2>
            <Button
              size="sm"
              variant="secondary"
              icon={<Plus size={14} />}
              onClick={() => setPortfolioModal(true)}
            >
              Add item
            </Button>
          </div>

          {user.portfolio && user.portfolio.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(user.portfolio as unknown as PortfolioItem[]).map((item) => (
                <PortfolioItemCard
                  key={item._id}
                  item={item}
                  editable
                  onDelete={handleDeletePortfolio}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No portfolio items yet. Add your first!</p>
          )}
        </div>
      )}

      {/* Add portfolio modal */}
      <Modal
        open={portfolioModal}
        onClose={() => setPortfolioModal(false)}
        title="Add Portfolio Item"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            required
            value={portfolioForm.title}
            onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
          />
          <Select
            label="Type"
            options={[
              { value: 'image', label: 'Image' },
              { value: 'video', label: 'Video' },
              { value: 'link',  label: 'Link'  },
            ]}
            value={portfolioForm.mediaType}
            onChange={(e) => setPortfolioForm({ ...portfolioForm, mediaType: e.target.value })}
          />
          <Input
            label="URL"
            placeholder="https://…"
            required
            value={portfolioForm.url}
            onChange={(e) => setPortfolioForm({ ...portfolioForm, url: e.target.value })}
          />
          <Textarea
            label="Description"
            rows={2}
            value={portfolioForm.description}
            onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button loading={addingPortfolio} onClick={handleAddPortfolio}>
              Add item
            </Button>
            <Button variant="outline" onClick={() => setPortfolioModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
