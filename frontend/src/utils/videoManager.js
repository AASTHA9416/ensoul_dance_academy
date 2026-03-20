const registeredVideos = new Set();
let currentlyUnmuted = null;
let currentAudioOwnerId = null;

const AUDIO_OWNER_EVENT = "ensoul:audio-owner-change";

function getVideoOwnerId(videoElement) {
  return videoElement?.dataset?.videoOwnerId || null;
}

function notifyAudioOwnerChange() {
  window.dispatchEvent(
    new CustomEvent(AUDIO_OWNER_EVENT, {
      detail: { ownerId: currentAudioOwnerId }
    })
  );
}

export function subscribeAudioOwnerChange(callback) {
  const handler = (event) => callback(event.detail?.ownerId || null);
  window.addEventListener(AUDIO_OWNER_EVENT, handler);
  callback(currentAudioOwnerId);
  return () => window.removeEventListener(AUDIO_OWNER_EVENT, handler);
}

export function registerVideoElement(videoElement) {
  if (!videoElement) {
    return;
  }
  registeredVideos.add(videoElement);
}

export function unregisterVideoElement(videoElement) {
  if (!videoElement) {
    return;
  }
  registeredVideos.delete(videoElement);
  if (currentlyUnmuted === videoElement) {
    currentlyUnmuted = null;
    currentAudioOwnerId = null;
    notifyAudioOwnerChange();
  }
}

export function muteVideo(videoElement) {
  if (!videoElement) {
    return;
  }
  videoElement.muted = true;
  videoElement.volume = 0;
  if (currentlyUnmuted === videoElement) {
    currentlyUnmuted = null;
    currentAudioOwnerId = null;
    notifyAudioOwnerChange();
  }
}

export function unmuteExclusive(videoElement) {
  if (!videoElement) {
    return;
  }

  registeredVideos.forEach((video) => {
    if (video !== videoElement) {
      video.muted = true;
      video.volume = 0;
    }
  });

  videoElement.muted = false;
  videoElement.volume = 1;
  currentlyUnmuted = videoElement;
  currentAudioOwnerId = getVideoOwnerId(videoElement);
  notifyAudioOwnerChange();
}

export function muteAllVideos() {
  registeredVideos.forEach((video) => {
    video.muted = true;
    video.volume = 0;
  });
  currentlyUnmuted = null;
  currentAudioOwnerId = null;
  notifyAudioOwnerChange();
}

export function observeVideoVisibility(videoElements, threshold = 0.5) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.intersectionRatio >= threshold) {
          video.play().catch(() => {});
        } else {
          video.pause();
          muteVideo(video);
        }
      });
    },
    { threshold: [0, threshold, 1] }
  );

  videoElements.forEach((video) => {
    if (video) {
      observer.observe(video);
    }
  });

  return () => observer.disconnect();
}
