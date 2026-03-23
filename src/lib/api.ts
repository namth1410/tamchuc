export const BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';
export const API_URL = `${BASE_URL}/api`;

export const fetchTrips = () => fetch(`${API_URL}/trips`).then(res => res.json());

export const fetchTripById = (id: string) => fetch(`${API_URL}/trips/${id}`).then(res => {
  if (!res.ok) throw new Error('Trip not found');
  return res.json();
});

export const createTrip = (tripData: any, coverFile: File | null = null) => {
  const formData = new FormData();
  formData.append('title', tripData.title);
  formData.append('date', tripData.date);
  formData.append('color', tripData.color);
  formData.append('bg', tripData.bg);
  if (coverFile) {
    formData.append('cover', coverFile);
  }

  return fetch(`${API_URL}/trips`, {
    method: 'POST',
    body: formData
  }).then(res => res.json());
};

export const fetchMessages = (tripId: string) => fetch(`${API_URL}/trips/${tripId}/messages`).then(res => res.json());

export const postMessage = (tripId: string, author: string, content: string) =>
  fetch(`${API_URL}/trips/${tripId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content })
  }).then(res => res.json());

export const fetchPhotos = (tripId: string) => fetch(`${API_URL}/trips/${tripId}/photos`).then(res => res.json());

export const uploadPhotos = (tripId: string, files: File[] | FileList, title: string, author: string) => {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('photos', file);
  });
  formData.append('title', title);
  formData.append('author', author);

  return fetch(`${API_URL}/trips/${tripId}/photos`, {
    method: 'POST',
    body: formData
  }).then(res => res.json());
};

export const deleteMessage = (tripId: string, msgId: string, author: string) =>
  fetch(`${API_URL}/trips/${tripId}/messages/${msgId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author })
  }).then(res => res.json());

export const deletePhoto = (tripId: string, photoId: string, author: string) =>
  fetch(`${API_URL}/trips/${tripId}/photos/${photoId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author })
  }).then(res => res.json());

export const togglePhotoLike = (tripId: string, photoId: string, author: string) =>
  fetch(`${API_URL}/trips/${tripId}/photos/${photoId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author })
  }).then(res => res.json());
