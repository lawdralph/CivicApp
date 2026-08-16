import test from 'node:test';
import assert from 'node:assert/strict';

import api, { apiService } from './api.js';

test('createReport should not silently fallback to mock data when the backend fails', async () => {
  const originalPost = api.post;

  api.post = async () => {
    throw new Error('MongoDB unavailable');
  };

  try {
    const formData = new FormData();
    formData.append('title', 'Broken drainage');
    formData.append('description', 'Water is pooling in front of the school.');
    formData.append('category', 'Drainage');
    formData.append('latitude', '6.5244');
    formData.append('longitude', '3.3792');

    await assert.rejects(
      () => apiService.createReport(formData),
      /MongoDB unavailable/
    );
  } finally {
    api.post = originalPost;
  }
});
