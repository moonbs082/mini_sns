import { useCallback, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { fetchRandomImages, hasUnsplashKey } from '../../utils/unsplash.js';

/**
 * ImagePicker 컴포넌트 - 랜덤 이미지 9장 중 하나를 선택 (새로고침으로 다시 뽑기)
 *
 * Props:
 * @param {object} selectedImage - 현재 선택된 이미지 객체 [Optional, 기본값: null]
 * @param {function} onSelect - 이미지를 고르면 호출 (이미지 객체 전달) [Required]
 *
 * Example usage:
 * <ImagePicker selectedImage={ image } onSelect={ setImage } />
 */
function ImagePicker({ selectedImage = null, onSelect }) {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('fitness');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadImages = useCallback(async (searchQuery) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      setImages(await fetchRandomImages(9, searchQuery));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    /** 처음 한 번만 기본 검색어로 불러오기 (이후는 새로고침 버튼) */
    loadImages('fitness');
  }, [loadImages]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      { !hasUnsplashKey && (
        <Alert severity="info">
          Unsplash 키가 설정되지 않아 무료 랜덤 이미지(Picsum)를 보여드려요.
        </Alert>
      ) }

      <Box sx={{ display: 'flex', gap: 1 }}>
        { hasUnsplashKey && (
          <TextField
            size="small"
            fullWidth
            value={ query }
            onChange={ (event) => setQuery(event.target.value) }
            onKeyDown={ (event) => event.key === 'Enter' && loadImages(query) }
            placeholder="검색어 (예: gym, running)"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                ),
              },
            }}
          />
        ) }
        <Button
          variant="outlined"
          startIcon={ <RefreshIcon /> }
          onClick={ () => loadImages(query) }
          disabled={ isLoading }
          sx={{ flexShrink: 0 }}
        >
          새로고침
        </Button>
      </Box>

      { errorMessage && <Alert severity="error">{ errorMessage }</Alert> }

      { isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={ 1 }>
          { images.map((image) => {
            const isSelected = selectedImage?.id === image.id;
            return (
              <Grid size={{ xs: 4 }} key={ image.id }>
                <Box
                  component="button"
                  type="button"
                  onClick={ () => onSelect(image) }
                  aria-label="이미지 선택"
                  aria-pressed={ isSelected }
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    p: 0,
                    border: 3,
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box
                    component="img"
                    src={ image.thumbUrl }
                    alt=""
                    loading="lazy"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  { isSelected && (
                    <CheckCircleIcon
                      color="primary"
                      sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'white', borderRadius: '50%' }}
                    />
                  ) }
                </Box>
              </Grid>
            );
          }) }
        </Grid>
      ) }

      { selectedImage && (
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          Photo by{ ' ' }
          <Link href={ selectedImage.creditUrl } target="_blank" rel="noreferrer">
            { selectedImage.credit }
          </Link>
          { hasUnsplashKey && (
            <>
              { ' ' }on{ ' ' }
              <Link href="https://unsplash.com/?utm_source=mini_sns&utm_medium=referral" target="_blank" rel="noreferrer">
                Unsplash
              </Link>
            </>
          ) }
        </Box>
      ) }
    </Box>
  );
}

export default ImagePicker;
