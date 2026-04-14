import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import './styles.css';

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString();
}

function CommentForm({ photoId }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const {userId} = useParams();

  const commentMutation = useMutation({
    mutationFn: (text) => api.post(`/commentsOfPhoto/${photoId}`, { comment: text }).then((res) => res.data),
    onSuccess: () => {
      setComment('');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['photos', userId] });
    },
    onError: (err) => {
      setError(err.response?.data || 'Failed to add comment. Please try again.');
    },
  });

  function handleSubmit() {
    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    commentMutation.mutate(comment);
  }

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        label="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={3}
      />

      {error && (
        <Typography color={"error"} variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button variant="contained" sx={{ mt: 1 }} onClick={handleSubmit} disabled={commentMutation.isPending}>
        {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
      </Button>
    </Box>
  );
}

function UserPhotos() {
  const { userId } = useParams();

  const { data: user, isPending: userPending, isError: userError } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/user/${userId}`).then((res) => res.data),
  });

  const { data: photos=[], isPending: photosPending, isError: photosError } = useQuery({
    queryKey: ['photos', userId],
    queryFn: () => api.get(`/photosOfUser/${userId}`).then((res) => res.data),
  });

  if (userPending || photosPending) {
    return <CircularProgress size={28} />;
  }

  if (userError || photosError) {
    return <Typography color="error">Unable to load this user's photos.</Typography>;
  }

  if (!user) {
    return <Typography>User not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      {photos.length === 0 ? (
        <Typography>No photos available for this user.</Typography>
      ) : (
        <Stack spacing={3}>
          {photos.map((photo) => (
            <Card key={photo._id}>
              <CardMedia
                component="img"
                image={`/images/${photo.file_name}`}
                alt={`Uploaded by ${user.first_name} ${user.last_name}`}
              />
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Posted: {formatDate(photo.date_time)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>

                {photo.comments && photo.comments.length > 0 ? (
                  <Stack spacing={2}>
                    {photo.comments.map((comment) => (
                      <Box key={comment._id}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(comment.date_time)}
                        </Typography>
                        <Typography variant="body1">
                          <MuiLink
                            component={Link}
                            to={`/users/${comment.user._id}`}
                            underline="hover"
                          >
                            {comment.user.first_name} {comment.user.last_name}
                          </MuiLink>
                          {': '}
                          {comment.comment}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography color="text.secondary">No comments yet.</Typography>
                )}

                <Divider sx={{ my: 2 }} />
                <CommentForm photoId={photo._id} />

              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default UserPhotos;
