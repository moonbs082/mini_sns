const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

/** Unsplash 키가 설정되어 있는지 여부 */
export const hasUnsplashKey = Boolean(ACCESS_KEY);

/**
 * 랜덤 이미지 여러 장 가져오기
 * - Unsplash 키가 있으면 Unsplash API 사용
 * - 키가 없으면 picsum.photos 랜덤 이미지로 대체
 * @param {number} count - 가져올 이미지 개수
 * @param {string} query - 검색어 (예: fitness) - Unsplash에서만 사용
 * @returns {Promise<Array<{ id: string, thumbUrl: string, url: string, credit: string, creditUrl: string }>>}
 */
export async function fetchRandomImages(count = 9, query = '') {
  if (!hasUnsplashKey) {
    return Array.from({ length: count }, () => {
      const seed = Math.random().toString(36).slice(2, 10);
      return {
        id: seed,
        thumbUrl: `https://picsum.photos/seed/${seed}/400/400`,
        url: `https://picsum.photos/seed/${seed}/1080/1080`,
        credit: 'Picsum Photos',
        creditUrl: 'https://picsum.photos',
      };
    });
  }

  const params = new URLSearchParams({ count: String(count), orientation: 'squarish' });
  if (query.trim()) {
    params.set('query', query.trim());
  }

  const response = await fetch(`https://api.unsplash.com/photos/random?${params}`, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!response.ok) {
    throw new Error(response.status === 403
      ? 'Unsplash 요청 한도(시간당 50회)를 초과했습니다. 잠시 후 다시 시도해 주세요.'
      : '이미지를 불러오지 못했습니다.');
  }

  const photos = await response.json();
  return photos.map((photo) => ({
    id: photo.id,
    thumbUrl: photo.urls.small,
    url: photo.urls.regular,
    credit: photo.user.name,
    creditUrl: `${photo.user.links.html}?utm_source=mini_sns&utm_medium=referral`,
    downloadLocation: photo.links.download_location,
  }));
}

/**
 * Unsplash 가이드라인: 사진을 실제로 사용할 때 다운로드 이벤트 전송
 * @param {string} downloadLocation - photo.links.download_location
 */
export function trackUnsplashDownload(downloadLocation) {
  if (!hasUnsplashKey || !downloadLocation) {
    return;
  }
  fetch(downloadLocation, { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }).catch(() => {});
}
