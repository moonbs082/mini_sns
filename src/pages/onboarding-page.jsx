import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import AnalysisReport from '../components/onboarding/analysis-report.jsx';
import NumberPicker from '../components/onboarding/number-picker.jsx';
import OptionList from '../components/onboarding/option-list.jsx';
import StepLayout from '../components/onboarding/step-layout.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { useBodyProfile } from '../hooks/use-body-profile.js';
import {
  BODY_PART_OPTIONS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  WEEKLY_COUNT_OPTIONS,
} from '../utils/body-analysis.js';

const TOTAL_STEPS = 8;
const ANALYZE_STEP = 7;

const INITIAL_BODY = {
  gender: '',
  heightCm: 170,
  weightKg: 65,
  age: 25,
  goal: '',
  targetParts: [],
  weeklyCount: 0,
};

/**
 * OnboardingPage - 첫 페이지: 성별 → 키 → 몸무게 → 나이 → 운동 목표 → 키우고 싶은 부위 → 주간 운동 횟수 → 분석 완료
 * 각 화면에서 선택 후 하단 "계속" 버튼으로 다음 화면으로 넘어간다.
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/onboarding" element={ <OnboardingPage /> } />
 */
function OnboardingPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { body: savedBody, saveBody, errorMessage } = useBodyProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [body, setBody] = useState(INITIAL_BODY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasLoadedSaved, setHasLoadedSaved] = useState(false);

  /** 다시 분석하는 경우 이전에 입력한 값을 기본값으로 */
  useEffect(() => {
    if (savedBody && !hasLoadedSaved) {
      setBody(savedBody);
      setHasLoadedSaved(true);
    }
  }, [savedBody, hasLoadedSaved]);

  useEffect(() => {
    if (stepIndex !== ANALYZE_STEP) return undefined;
    setIsAnalyzing(true);
    const timer = setTimeout(() => setIsAnalyzing(false), 1600);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const updateBody = (key, value) => setBody((prev) => ({ ...prev, [key]: value }));
  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, ANALYZE_STEP));
  const goBack = stepIndex > 0 ? () => setStepIndex((prev) => prev - 1) : undefined;

  const handleFinish = async () => {
    const isSaved = await saveBody(body);
    if (!isSaved) return;
    if (profile) {
      navigate('/me');
      return;
    }
    /** 첫 페이지가 끝나면 바로 회원가입 페이지로 */
    navigate('/auth', { state: { mode: 'signup' } });
  };

  const steps = [
    {
      title: '성별을 선택해 주세요',
      description: '기초대사량 계산에 사용돼요.',
      isValid: Boolean(body.gender),
      content: (
        <OptionList
          options={ GENDER_OPTIONS }
          value={ body.gender }
          columns={ 2 }
          onChange={ (value) => updateBody('gender', value) }
        />
      ),
    },
    {
      title: '키가 어떻게 되세요?',
      isValid: true,
      content: (
        <NumberPicker value={ body.heightCm } min={ 120 } max={ 220 } unit="cm" onChange={ (value) => updateBody('heightCm', value) } />
      ),
    },
    {
      title: '몸무게를 알려주세요',
      isValid: true,
      content: (
        <NumberPicker value={ body.weightKg } min={ 30 } max={ 160 } step={ 0.5 } unit="kg" onChange={ (value) => updateBody('weightKg', value) } />
      ),
    },
    {
      title: '나이를 선택해 주세요',
      isValid: true,
      content: (
        <NumberPicker value={ body.age } min={ 10 } max={ 80 } unit="세" onChange={ (value) => updateBody('age', value) } />
      ),
    },
    {
      title: '운동 목표가 무엇인가요?',
      description: '가장 중요한 목표 하나를 골라주세요.',
      isValid: Boolean(body.goal),
      content: (
        <OptionList options={ GOAL_OPTIONS } value={ body.goal } onChange={ (value) => updateBody('goal', value) } />
      ),
    },
    {
      title: '키우고 싶은 부위를 골라주세요',
      description: '여러 개 선택할 수 있어요.',
      isValid: body.targetParts.length > 0,
      content: (
        <OptionList
          options={ BODY_PART_OPTIONS }
          value={ body.targetParts }
          isMultiple
          columns={ 2 }
          onChange={ (value) => updateBody('targetParts', value) }
        />
      ),
    },
    {
      title: '일주일에 몇 번 운동할까요?',
      description: '이번 주부터 운동할 날짜를 맞춰 드릴게요.',
      isValid: body.weeklyCount > 0,
      content: (
        <OptionList
          options={ WEEKLY_COUNT_OPTIONS }
          value={ body.weeklyCount }
          onChange={ (value) => updateBody('weeklyCount', value) }
        />
      ),
    },
    {
      title: isAnalyzing ? '맞춤 분석 중이에요' : '분석이 완료됐어요!',
      description: isAnalyzing ? '입력한 정보로 몸 상태와 운동 계획을 계산하고 있어요.' : '나에게 맞춘 몸 상태와 이번 주 운동 계획이에요.',
      isValid: !isAnalyzing,
      content: isAnalyzing ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 8 }}>
          <CircularProgress color="secondary" size={ 64 } thickness={ 5 } />
          <Box sx={{ fontWeight: 700, color: 'text.secondary' }}>근력 향상 시기 계산 중...</Box>
        </Box>
      ) : (
        <AnalysisReport body={ body } />
      ),
    },
  ];

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === ANALYZE_STEP;

  return (
    <Box>
      <StepLayout
        stepIndex={ stepIndex }
        totalSteps={ TOTAL_STEPS }
        title={ currentStep.title }
        description={ currentStep.description }
        isNextDisabled={ !currentStep.isValid }
        nextLabel={ isLastStep && !profile ? '계속 (회원가입)' : '계속' }
        onNext={ isLastStep ? handleFinish : goNext }
        onBack={ goBack }
      >
        { errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{ errorMessage }</Alert> }
        { currentStep.content }
        { stepIndex === 0 && !profile && (
          <Box sx={{ textAlign: 'center', mt: 4, fontSize: '0.9rem', color: 'text.secondary' }}>
            이미 계정이 있나요?{ ' ' }
            <Link component={ RouterLink } to="/auth" color="secondary" sx={{ fontWeight: 700 }}>
              로그인
            </Link>
          </Box>
        ) }
      </StepLayout>
    </Box>
  );
}

export default OnboardingPage;
