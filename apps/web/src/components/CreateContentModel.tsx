import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { addContent } from '../api/addcontent';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import type { ContentType } from '@/lib/types';
import { AxiosError } from 'axios';

interface CreateContentModelProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModel({ open, onClose }: CreateContentModelProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<ContentType>('YOUTUBE');

  const { mutate, isPending } = useMutation({
    mutationFn: addContent,
    onSuccess: () => {
      toast.success('Content added successfully');
      queryClient.invalidateQueries({ queryKey: ['content'] });
      setTitle('');
      setLink('');
      setType('YOUTUBE');
      onClose();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(Object.values(error.response?.data?.cause).join(', '));
      }
    },
  });

  const handleSubmit = () => {
    if (!title || !link || !type) {
      toast.error('Please fill in all fields');
      return;
    }
    mutate({ title, link, type });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Content</DialogTitle>
          <DialogDescription>
            Save a YouTube video or Twitter post to your brain.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              placeholder="Paste YouTube or Twitter URL"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as ContentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YOUTUBE">YouTube</SelectItem>
                <SelectItem value="TWITTER">Twitter</SelectItem>
                <SelectItem value="ARTICLE">Article</SelectItem>
                <SelectItem value="DOCUMENT">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Content'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
