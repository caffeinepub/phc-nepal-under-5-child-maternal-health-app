import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSavePost } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { PostCategory } from '../backend';
import type { Post } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Users, Plus, MessageCircle, Loader2, Send, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const OTP_VERIFIED_KEY = 'phc_community_verified';

function getCategoryColor(cat: PostCategory): { bg: string; text: string } {
  const map: Record<PostCategory, { bg: string; text: string }> = {
    [PostCategory.pregnancy]: { bg: '#fce7f3', text: '#9d174d' },
    [PostCategory.newborn]: { bg: '#dcfce7', text: '#166534' },
    [PostCategory.toddler]: { bg: '#dbeafe', text: '#1e40af' },
    [PostCategory.feeding]: { bg: '#ffedd5', text: '#9a3412' },
    [PostCategory.vaccination]: { bg: '#e0e7ff', text: '#3730a3' },
    [PostCategory.mentalHealth]: { bg: '#f3e8ff', text: '#6b21a8' },
  };
  return map[cat] || { bg: '#f3f4f6', text: '#374151' };
}

interface PostCardProps {
  post: Post;
  currentPrincipal?: string;
  onReply: (postId: string) => void;
  t: ReturnType<typeof useLanguage>['t'];
}

function PostCard({ post, currentPrincipal, onReply, t }: PostCardProps) {
  const colors = getCategoryColor(post.category);
  const isOwn = currentPrincipal && post.authorPrincipal.toString() === currentPrincipal;

  const timeAgo = (ts: bigint) => {
    const diff = Date.now() - Number(ts) / 1_000_000;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const categoryLabel = (cat: PostCategory): string => {
    const map: Record<PostCategory, string> = {
      [PostCategory.pregnancy]: t.community.categories.pregnancy,
      [PostCategory.newborn]: t.community.categories.newborn,
      [PostCategory.toddler]: t.community.categories.toddler,
      [PostCategory.feeding]: t.community.categories.feeding,
      [PostCategory.vaccination]: t.community.categories.vaccination,
      [PostCategory.mentalHealth]: t.community.categories.mentalHealth,
    };
    return map[cat] || cat;
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-sm line-clamp-2" style={{ color: 'oklch(0.28 0.1 145)' }}>
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.community.postedBy}{' '}
              <span className="font-medium">{post.author}</span>
              {isOwn && <span className="ml-1" style={{ color: 'oklch(0.72 0.16 55)' }}>(you)</span>}
              {' · '}{timeAgo(post.timestamp)}
            </p>
          </div>
          <Badge className="text-xs flex-shrink-0" style={{ backgroundColor: colors.bg, color: colors.text }}>
            {categoryLabel(post.category)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.content}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {post.replies.length}{' '}
            {post.replies.length === 1 ? t.community.reply_singular : t.community.replies}
          </span>
          <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => onReply(post.id)}>
            <Send className="h-3 w-3" />{t.community.reply}
          </Button>
        </div>
        {post.replies.length > 0 && (
          <div className="mt-3 space-y-2 border-t pt-3">
            {post.replies.slice(0, 2).map((reply, i) => (
              <div key={i} className="bg-secondary rounded-lg p-2">
                <p className="text-xs font-medium" style={{ color: 'oklch(0.28 0.1 145)' }}>{reply.author}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CommunityPage() {
  const { t } = useLanguage();
  const { identity } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const savePost = useSavePost();

  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<PostCategory | 'all'>('all');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<PostCategory>(PostCategory.pregnancy);
  const [replyContent, setReplyContent] = useState('');

  const isAuthenticated = !!identity;
  const isVerified = localStorage.getItem(OTP_VERIFIED_KEY) === 'true';

  const handleCreateClick = () => {
    if (!isAuthenticated) { toast.error(t.community.loginToPost); return; }
    if (!isVerified) { setShowOTPModal(true); return; }
    setShowCreateModal(true);
  };

  const handleOTPContinue = () => {
    localStorage.setItem(OTP_VERIFIED_KEY, 'true');
    setShowOTPModal(false);
    setShowCreateModal(true);
  };

  const handleSubmitPost = async () => {
    if (!postTitle.trim() || !postContent.trim()) return;
    const id = `post_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const newPost: Post = {
      id,
      title: postTitle.trim(),
      content: postContent.trim(),
      author: profile?.name || 'Anonymous',
      authorPrincipal: identity!.getPrincipal(),
      category: postCategory,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      replies: [],
    };
    try {
      await savePost.mutateAsync({ id, post: newPost });
      setPosts((prev) => [newPost, ...prev]);
      toast.success(t.community.postSaved);
      setShowCreateModal(false);
      setPostTitle('');
      setPostContent('');
      setPostCategory(PostCategory.pregnancy);
    } catch {
      toast.error(t.app.error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !showReplyModal) return;
    const parentPost = posts.find((p) => p.id === showReplyModal);
    if (!parentPost) return;

    const replyId = `reply_${Date.now()}`;
    const reply: Post = {
      id: replyId,
      title: '',
      content: replyContent.trim(),
      author: profile?.name || 'Anonymous',
      authorPrincipal: identity!.getPrincipal(),
      category: parentPost.category,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      replies: [],
    };

    const updatedPost: Post = { ...parentPost, replies: [...parentPost.replies, reply] };
    try {
      await savePost.mutateAsync({ id: parentPost.id, post: updatedPost });
      setPosts((prev) => prev.map((p) => (p.id === parentPost.id ? updatedPost : p)));
      toast.success(t.community.replySaved);
      setShowReplyModal(null);
      setReplyContent('');
    } catch {
      toast.error(t.app.error);
    }
  };

  const allCategories: PostCategory[] = [
    PostCategory.pregnancy,
    PostCategory.newborn,
    PostCategory.toddler,
    PostCategory.feeding,
    PostCategory.vaccination,
    PostCategory.mentalHealth,
  ];

  const filteredPosts =
    filterCategory === 'all' ? posts : posts.filter((p) => p.category === filterCategory);

  const getCategoryLabel = (cat: PostCategory): string => {
    const map: Record<PostCategory, string> = {
      [PostCategory.pregnancy]: t.community.categories.pregnancy,
      [PostCategory.newborn]: t.community.categories.newborn,
      [PostCategory.toddler]: t.community.categories.toddler,
      [PostCategory.feeding]: t.community.categories.feeding,
      [PostCategory.vaccination]: t.community.categories.vaccination,
      [PostCategory.mentalHealth]: t.community.categories.mentalHealth,
    };
    return map[cat] || cat;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl p-4 text-white" style={{ backgroundColor: 'oklch(0.28 0.1 145)' }}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: 'oklch(0.72 0.16 55)' }} />
          {t.community.title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.88 0.03 85)' }}>{t.community.subtitle}</p>
      </div>

      {/* Hero illustration */}
      <div className="relative h-32 rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/community-illustration.dim_800x400.png"
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'oklch(0.28 0.1 145 / 50%)' }}
        >
          <Button
            onClick={handleCreateClick}
            className="gap-2 font-semibold shadow-lg"
            style={{ backgroundColor: 'oklch(0.72 0.16 55)', color: 'oklch(0.15 0.04 55)' }}
          >
            <Plus className="h-4 w-4" />{t.community.createPost}
          </Button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterCategory('all')}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          style={
            filterCategory === 'all'
              ? { backgroundColor: 'oklch(0.38 0.1 145)', color: 'white' }
              : { backgroundColor: 'oklch(0.93 0.02 85)', color: 'oklch(0.38 0.1 145)' }
          }
        >
          {t.community.filterAll}
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={
              filterCategory === cat
                ? { backgroundColor: 'oklch(0.38 0.1 145)', color: 'white' }
                : { backgroundColor: 'oklch(0.93 0.02 85)', color: 'oklch(0.38 0.1 145)' }
            }
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {filteredPosts.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">{t.community.noPostsYet}</p>
            {isAuthenticated && (
              <Button
                onClick={handleCreateClick}
                className="mt-3 text-white"
                style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}
              >
                <Plus className="h-4 w-4 mr-1" />{t.community.createPost}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentPrincipal={identity?.getPrincipal().toString()}
              onReply={(id) => setShowReplyModal(id)}
              t={t}
            />
          ))}
        </div>
      )}

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-12 w-12" style={{ color: 'oklch(0.38 0.1 145)' }} />
            </div>
            <DialogTitle className="text-center">{t.community.otpTitle}</DialogTitle>
            <DialogDescription className="text-center text-sm">{t.community.otpSubtitle}</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl p-3 text-xs text-muted-foreground bg-secondary mt-2">
            {t.community.otpNote}
          </div>
          <Button
            onClick={handleOTPContinue}
            className="w-full mt-2 text-white"
            style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}
          >
            {t.community.otpContinue}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Create Post Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle style={{ color: 'oklch(0.28 0.1 145)' }}>{t.community.createPost}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <Label className="text-xs">{t.community.postTitle}</Label>
              <Input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder={t.community.postTitle}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">{t.community.category}</Label>
              <Select
                value={postCategory}
                onValueChange={(v) => setPostCategory(v as PostCategory)}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{getCategoryLabel(cat)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Content</Label>
              <Textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={t.community.postContent}
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitPost}
                disabled={savePost.isPending}
                className="flex-1 text-white"
                style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}
              >
                {savePost.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : t.app.submit}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                {t.app.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={!!showReplyModal} onOpenChange={() => setShowReplyModal(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle style={{ color: 'oklch(0.28 0.1 145)' }}>{t.community.reply}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={t.community.replyPlaceholder}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReply}
                disabled={savePost.isPending}
                className="flex-1 text-white"
                style={{ backgroundColor: 'oklch(0.38 0.1 145)' }}
              >
                {savePost.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : t.community.reply}
              </Button>
              <Button variant="outline" onClick={() => setShowReplyModal(null)} className="flex-1">
                {t.app.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
