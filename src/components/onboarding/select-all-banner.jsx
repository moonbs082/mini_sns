import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

/**
 * SelectAllBanner 컴포넌트 - 선택지 목록 아래에 놓는 작은 '전체 선택' 배너
 * '전체 선택' 글자 뒤의 정사각형 체크박스를 눌러 모두 선택 / 모두 해제한다.
 *
 * Props:
 * @param {boolean} isChecked - 모든 항목이 선택된 상태인지 여부 [Required]
 * @param {function} onToggle - 배너를 누르면 호출 (다음 체크 상태 전달) [Required]
 * @param {string} label - 배너 문구 [Optional, 기본값: '전체 선택']
 *
 * Example usage:
 * <SelectAllBanner isChecked={ isAllSelected } onToggle={ handleSelectAll } />
 */
function SelectAllBanner({ isChecked, onToggle, label = '전체 선택' }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
      <ButtonBase
        role="checkbox"
        aria-checked={ isChecked }
        onClick={ () => onToggle(!isChecked) }
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          border: 1,
          borderColor: isChecked ? 'primary.main' : 'grey.300',
          bgcolor: isChecked ? 'grey.100' : 'background.paper',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'text.primary',
          transition: 'all 0.15s ease',
        }}
      >
        { label }
        { isChecked
          ? <CheckBoxIcon fontSize="small" sx={{ color: 'primary.main' }} />
          : <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: 'grey.500' }} /> }
      </ButtonBase>
    </Box>
  );
}

export default SelectAllBanner;
