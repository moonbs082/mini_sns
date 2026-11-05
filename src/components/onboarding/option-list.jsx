import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

/**
 * OptionList 컴포넌트 - 큰 터치 영역의 선택 카드 목록 (단일/복수 선택)
 *
 * Props:
 * @param {Array<{ value: any, label: string, description: string }>} options - 선택지 [Required]
 * @param {any} value - 단일 선택 값 또는 복수 선택 값 배열 [Required]
 * @param {boolean} isMultiple - 복수 선택 여부 [Optional, 기본값: false]
 * @param {number} columns - 한 줄에 놓을 카드 수 [Optional, 기본값: 1]
 * @param {function} onChange - 선택이 바뀌면 호출 (새 값 전달) [Required]
 *
 * Example usage:
 * <OptionList options={ GENDER_OPTIONS } value={ gender } onChange={ setGender } columns={ 2 } />
 */
function OptionList({ options, value, isMultiple = false, columns = 1, onChange }) {
  const isSelected = (optionValue) => (isMultiple ? value.includes(optionValue) : value === optionValue);

  const handleClick = (optionValue) => {
    if (!isMultiple) {
      onChange(optionValue);
      return;
    }
    onChange(isSelected(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue]);
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 1.5 }}>
      { options.map((option) => {
        const selected = isSelected(option.value);
        return (
          <ButtonBase
            key={ option.value }
            onClick={ () => handleClick(option.value) }
            aria-pressed={ selected }
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              textAlign: 'left',
              minHeight: columns > 1 ? 72 : 64,
              px: 2.5,
              py: 1.5,
              borderRadius: 3,
              border: 2,
              borderColor: selected ? 'primary.main' : 'grey.300',
              bgcolor: selected ? 'primary.main' : 'background.paper',
              color: selected ? 'common.white' : 'text.primary',
              transition: 'all 0.15s ease',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ fontWeight: 800, fontSize: '1.05rem' }}>{ option.label }</Box>
              { option.description && (
                <Box sx={{ fontSize: '0.85rem', color: selected ? 'grey.300' : 'text.secondary', mt: 0.25 }}>
                  { option.description }
                </Box>
              ) }
            </Box>
            { selected
              ? <CheckCircleIcon sx={{ color: 'secondary.main', bgcolor: 'common.white', borderRadius: '50%' }} />
              : <RadioButtonUncheckedIcon sx={{ color: 'grey.400' }} /> }
          </ButtonBase>
        );
      }) }
    </Box>
  );
}

export default OptionList;
