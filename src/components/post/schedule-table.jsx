import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EventNoteIcon from '@mui/icons-material/EventNote';

/**
 * ScheduleTable 컴포넌트 - 게시물의 운동 기록표를 표로 보여줌
 *
 * Props:
 * @param {object} schedule - { date: string, items: [{ name, sets, reps, weight }] } [Required]
 *
 * Example usage:
 * <ScheduleTable schedule={ post.schedule } />
 */
function ScheduleTable({ schedule }) {
  if (!schedule?.items?.length) {
    return null;
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: 'action.hover',
        fontSize: '0.875rem',
        fontWeight: 600,
      }}>
        <EventNoteIcon fontSize="small" color="primary" />
        운동 기록 { schedule.date ? `· ${schedule.date}` : '' }
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>운동</TableCell>
            <TableCell align="right">세트</TableCell>
            <TableCell align="right">횟수</TableCell>
            <TableCell align="right">무게(kg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { schedule.items.map((item, index) => (
            <TableRow key={ `${item.name}-${index}` }>
              <TableCell>{ item.name }</TableCell>
              <TableCell align="right">{ item.sets || '-' }</TableCell>
              <TableCell align="right">{ item.reps || '-' }</TableCell>
              <TableCell align="right">{ item.weight || '-' }</TableCell>
            </TableRow>
          )) }
        </TableBody>
      </Table>
    </Box>
  );
}

export default ScheduleTable;
