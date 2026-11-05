import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * NumberPicker 컴포넌트 - 큰 숫자 표시 + 슬라이더 + / - 버튼으로 숫자 선택
 *
 * Props:
 * @param {number} value - 현재 값 [Required]
 * @param {number} min - 최솟값 [Required]
 * @param {number} max - 최댓값 [Required]
 * @param {number} step - 증감 단위 [Optional, 기본값: 1]
 * @param {string} unit - 단위 (cm, kg, 세) [Required]
 * @param {function} onChange - 값이 바뀌면 호출 (새 값 전달) [Required]
 *
 * Example usage:
 * <NumberPicker value={ height } min={ 120 } max={ 220 } unit="cm" onChange={ setHeight } />
 */
function NumberPicker({ value, min, max, step = 1, unit, onChange }) {
  const clamp = (nextValue) => {
    const rounded = Math.round(nextValue / step) * step;
    return Math.min(max, Math.max(min, Number(rounded.toFixed(1))));
  };

  const buttonSx = {
    width: 56,
    height: 56,
    border: 2,
    borderColor: 'grey.300',
    color: 'primary.main',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, pt: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
        <IconButton aria-label="줄이기" onClick={ () => onChange(clamp(value - step)) } sx={ buttonSx }>
          <RemoveIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, minWidth: 170, justifyContent: 'center' }}>
          <Box sx={{ fontSize: { xs: '3.5rem', md: '4.5rem' }, fontWeight: 900, lineHeight: 1.2 }}>{ value }</Box>
          <Box sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'secondary.main' }}>{ unit }</Box>
        </Box>
        <IconButton aria-label="늘리기" onClick={ () => onChange(clamp(value + step)) } sx={ buttonSx }>
          <AddIcon />
        </IconButton>
      </Box>

      <Slider
        value={ value }
        min={ min }
        max={ max }
        step={ step }
        onChange={ (_event, nextValue) => onChange(nextValue) }
        aria-label={ `${unit} 선택` }
        color="secondary"
        sx={{ width: '100%', maxWidth: 420, height: 8 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 420, mt: -3, fontSize: '0.8rem', color: 'text.secondary' }}>
        <span>{ min }{ unit }</span>
        <span>{ max }{ unit }</span>
      </Box>
    </Box>
  );
}

export default NumberPicker;
