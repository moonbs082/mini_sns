import Box from '@mui/material/Box';

/**
 * TurtleHeroArt 컴포넌트 - 사람 형체의 거북이가 등을 보이며
 * 더블 바이셉스(양팔 근육 자랑) 포즈를 취하는 일러스트 (SVG)
 *
 * Props:
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <TurtleHeroArt sx={{ position: 'absolute', inset: 0 }} />
 */
function TurtleHeroArt({ sx }) {
  const skin = '#8bb94a';
  const skinDark = '#5f8a2b';
  const shell = '#6d4c41';
  const shellDark = '#4e342e';
  const scuteLine = '#f9a825';

  /** 한쪽 팔 (반대쪽은 좌우 반전) */
  const arm = (
    <g>
      <path d="M150 112 Q112 118 92 104" stroke={ skinDark } strokeWidth="30" strokeLinecap="round" fill="none" />
      <path d="M150 112 Q112 118 92 104" stroke={ skin } strokeWidth="24" strokeLinecap="round" fill="none" />
      <ellipse cx="116" cy="98" rx="20" ry="15" fill={ skin } stroke={ skinDark } strokeWidth="3" />
      <path d="M92 104 Q80 78 86 52" stroke={ skinDark } strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M92 104 Q80 78 86 52" stroke={ skin } strokeWidth="20" strokeLinecap="round" fill="none" />
      <circle cx="87" cy="44" r="15" fill={ skin } stroke={ skinDark } strokeWidth="3" />
      <path d="M58 40 L44 34 M60 56 L44 58 M66 24 L56 12" stroke={ scuteLine } strokeWidth="4" strokeLinecap="round" />
    </g>
  );

  return (
    <Box
      component="svg"
      viewBox="0 0 400 300"
      role="img"
      aria-label="등을 보이며 근육 포즈를 취하는 거북이"
      preserveAspectRatio="xMidYMid meet"
      sx={ sx }
    >
      <defs>
        <radialGradient id="hero-spot" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#d32f2f" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#hero-spot)" />
      <ellipse cx="200" cy="292" rx="110" ry="10" fill="#000000" opacity="0.5" />

      { /* 다리 */ }
      <path d="M176 236 L170 290 L194 290 L198 236 Z" fill={ skin } stroke={ skinDark } strokeWidth="3" />
      <path d="M202 236 L206 290 L230 290 L224 236 Z" fill={ skin } stroke={ skinDark } strokeWidth="3" />

      { /* 반바지 */ }
      <path d="M150 210 L250 210 L246 252 L204 252 L200 238 L196 252 L154 252 Z" fill="#d32f2f" stroke="#8e1b1b" strokeWidth="3" />

      { /* 어깨 + 팔 */ }
      <ellipse cx="200" cy="112" rx="70" ry="22" fill={ skin } stroke={ skinDark } strokeWidth="3" />
      { arm }
      <g transform="translate(400 0) scale(-1 1)">{ arm }</g>

      { /* 목 + 뒷머리 */ }
      <rect x="188" y="84" width="24" height="26" rx="8" fill={ skin } stroke={ skinDark } strokeWidth="3" />
      <circle cx="200" cy="74" r="24" fill={ skin } stroke={ skinDark } strokeWidth="3" />

      { /* 등껍질 */ }
      <ellipse cx="200" cy="162" rx="62" ry="74" fill={ shell } stroke={ shellDark } strokeWidth="6" />
      <g fill={ shellDark } stroke={ scuteLine } strokeWidth="2.5" strokeLinejoin="round">
        <path d="M200 132 L222 145 L222 171 L200 184 L178 171 L178 145 Z" />
        <path d="M200 98 L218 108 L216 128 L200 132 L184 128 L182 108 Z" />
        <path d="M200 188 L216 194 L218 216 L200 228 L182 216 L184 194 Z" />
        <path d="M226 142 L248 128 L258 156 L248 182 L226 172 Z" />
        <path d="M174 142 L152 128 L142 156 L152 182 L174 172 Z" />
      </g>
    </Box>
  );
}

export default TurtleHeroArt;
