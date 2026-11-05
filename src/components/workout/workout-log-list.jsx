import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';

/**
 * 'YYYY-MM-DD' → '11월 5일 (수)'
 * @param {string} dateKey - 날짜 문자열
 * @returns {string}
 */
function formatDateHeader(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

/**
 * WorkoutLogList 컴포넌트 - 날짜별로 묶은 운동 기록표
 *
 * Props:
 * @param {Array<object>} logs - workout_logs 행 목록 (최신 날짜순) [Required]
 * @param {function} onDelete - 기록 삭제 (id 전달) [Required]
 *
 * Example usage:
 * <WorkoutLogList logs={ logs } onDelete={ handleDelete } />
 */
function WorkoutLogList({ logs, onDelete }) {
  if (logs.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary', bgcolor: 'background.paper', borderRadius: 4 }}>
        아직 기록이 없어요. 오늘 한 운동을 추가해 보세요!
      </Box>
    );
  }

  const groups = logs.reduce((acc, log) => {
    (acc[log.workout_date] ||= []).push(log);
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      { Object.entries(groups).map(([dateKey, items]) => (
        <Paper key={ dateKey } elevation={ 0 } sx={{ borderRadius: 3, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
          <Box sx={{ px: 2, py: 1.25, bgcolor: 'primary.main', color: 'common.white', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
            <span>{ formatDateHeader(dateKey) }</span>
            <Box component="span" sx={{ color: 'warning.main', fontSize: '0.875rem' }}>{ items.length }종목</Box>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 800, color: 'text.secondary', whiteSpace: 'nowrap' } }}>
                  <TableCell>종목</TableCell>
                  <TableCell align="right">세트</TableCell>
                  <TableCell align="right">횟수</TableCell>
                  <TableCell align="right">kg</TableCell>
                  <TableCell padding="checkbox" />
                </TableRow>
              </TableHead>
              <TableBody>
                { items.map((log) => (
                  <TableRow key={ log.id }>
                    <TableCell>
                      <Box sx={{ fontWeight: 700 }}>{ log.exercise }</Box>
                      { log.memo && <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{ log.memo }</Box> }
                    </TableCell>
                    <TableCell align="right">{ log.sets ?? '-' }</TableCell>
                    <TableCell align="right">{ log.reps ?? '-' }</TableCell>
                    <TableCell align="right">{ log.weight_kg ?? '-' }</TableCell>
                    <TableCell padding="checkbox">
                      <IconButton aria-label="기록 삭제" size="small" onClick={ () => onDelete(log.id) }>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )) }
    </Box>
  );
}

export default WorkoutLogList;
