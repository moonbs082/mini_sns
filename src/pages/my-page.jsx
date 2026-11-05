import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import AnalysisReport from '../components/onboarding/analysis-report.jsx';
import PostFeed from '../components/post/post-feed.jsx';
import ProfileEditDialog from '../components/profile/profile-edit-dialog.jsx';
import SectionTitle from '../components/ui/section-title.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { useBodyProfile } from '../hooks/use-body-profile.js';
import {
  BODY_PART_OPTIONS,
  findLabel,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
} from '../utils/body-analysis.js';
import { formatFullDate } from '../utils/format-date.js';

/**
 * MyPage - 마이페이지 (프로필 · 내 신체 정보와 분석 결과 · 내 게시물)
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/me" element={ <RequireAuth><MyPage /></RequireAuth> } />
 */
function MyPage() {
  const navigate = useNavigate();
  const { profile, refreshProfile, signOut } = useAuth();
  const { body, isLoading } = useBodyProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const paperSx = { p: { xs: 2, md: 3 }, borderRadius: 4, border: 1, borderColor: 'grey.200' };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper elevation={ 0 } sx={{ ...paperSx, bgcolor: 'primary.main', color: 'common.white', borderColor: 'primary.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={ profile.avatar_url || undefined }
            sx={{ width: 76, height: 76, bgcolor: 'secondary.main', fontSize: '2rem', fontWeight: 900, border: 3, borderColor: 'common.white' }}
          >
            { profile.display_name?.[0] }
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Box sx={{ fontSize: '1.35rem', fontWeight: 900, lineHeight: 1.3 }}>{ profile.display_name }</Box>
            <Box sx={{ color: 'warning.main', fontWeight: 700 }}>@{ profile.username }</Box>
            <Box sx={{ color: 'grey.500', fontSize: '0.8rem', mt: 0.25 }}>{ formatFullDate(profile.created_at) } 가입</Box>
          </Box>
        </Box>
        <Box sx={{ mt: 2, color: 'grey.300', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
          { profile.bio || '소개글을 작성해 보세요.' }
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={ <EditOutlinedIcon /> }
            onClick={ () => setIsEditOpen(true) }
            sx={{ flex: 1, color: 'primary.main', bgcolor: 'common.white' }}
          >
            프로필 수정
          </Button>
          <Button
            variant="outlined"
            startIcon={ <LogoutIcon /> }
            onClick={ handleSignOut }
            sx={{ color: 'common.white', borderColor: 'grey.700' }}
          >
            로그아웃
          </Button>
        </Box>
      </Paper>

      <Paper elevation={ 0 } sx={ paperSx }>
        <SectionTitle
          action={ (
            <Button size="small" color="secondary" startIcon={ <RefreshIcon /> } onClick={ () => navigate('/onboarding') }>
              다시 분석
            </Button>
          ) }
        >
          내 몸 분석
        </SectionTitle>
        { isLoading && <CircularProgress color="secondary" size={ 28 } /> }
        { !isLoading && !body && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ color: 'text.secondary' }}>아직 신체 정보가 없어요.</Box>
            <Button variant="contained" onClick={ () => navigate('/onboarding') }>신체 정보 입력하기</Button>
          </Box>
        ) }
        { body && (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              { [
                findLabel(GENDER_OPTIONS, body.gender),
                `${body.heightCm}cm`,
                `${body.weightKg}kg`,
                `${body.age}세`,
                findLabel(GOAL_OPTIONS, body.goal),
                `주 ${body.weeklyCount}회`,
                ...body.targetParts.map((part) => findLabel(BODY_PART_OPTIONS, part)),
              ].map((label, index) => (
                <Box
                  key={ `${label}-${index}` }
                  sx={{ px: 1.25, py: 0.5, borderRadius: 2, bgcolor: 'grey.100', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  { label }
                </Box>
              )) }
            </Box>
            <AnalysisReport body={ body } isCompact />
          </>
        ) }
      </Paper>

      <Box>
        <SectionTitle>내 게시물</SectionTitle>
        <PostFeed userId={ profile.id } emptyMessage="아직 작성한 게시물이 없어요." />
      </Box>

      { isEditOpen && (
        <ProfileEditDialog
          isOpen={ isEditOpen }
          profile={ profile }
          onClose={ () => setIsEditOpen(false) }
          onSaved={ refreshProfile }
        />
      ) }
    </Box>
  );
}

export default MyPage;
