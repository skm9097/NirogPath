export const CBAC_QUESTIONS = [
  {
    id: 'age_group',
    question: 'What is your age group?',
    question_hi: 'आपकी आयु कितनी है?',
    type: 'single',
    options: [
      { label: '30–39', value: '30-39', score: 0 },
      { label: '40–49', value: '40-49', score: 1 },
      { label: '50–59', value: '50-59', score: 1 },
      { label: '60+', value: '60+', score: 1 },
    ],
  },
  {
    id: 'smoking',
    question: 'Do you smoke or chew tobacco?',
    question_hi: 'क्या आप तंबाकू या बीड़ी पीते हैं?',
    type: 'yesno',
    score_if_yes: 1,
  },
  {
    id: 'alcohol',
    question: 'Do you drink alcohol regularly?',
    question_hi: 'क्या आप नियमित रूप से शराब पीते हैं?',
    type: 'yesno',
    score_if_yes: 1,
  },
  {
    id: 'waist',
    question: 'Is your waist above healthy limits? (Men > 90cm, Women > 80cm)',
    question_hi: 'क्या आपकी कमर सामान्य से ज़्यादा है? (पुरुष > 90cm, महिला > 80cm)',
    type: 'yesno',
    score_if_yes: 1,
  },
  {
    id: 'physical_activity',
    question: 'Do you exercise less than 150 minutes per week?',
    question_hi: 'क्या आप प्रति सप्ताह 150 मिनट से कम व्यायाम करते हैं?',
    type: 'yesno',
    score_if_yes: 1,
  },
  {
    id: 'family_diabetes',
    question: 'Does anyone in your family have diabetes?',
    question_hi: 'क्या आपके परिवार में किसी को मधुमेह (शुगर) है?',
    type: 'yesno',
    score_if_yes: 1,
  },
  {
    id: 'family_hypertension',
    question: 'Does anyone in your family have high blood pressure?',
    question_hi: 'क्या आपके परिवार में किसी को हाई ब्लड प्रेशर है?',
    type: 'yesno',
    score_if_yes: 1,
  },
  {
    id: 'family_heart',
    question: 'Does anyone in your family have heart disease?',
    question_hi: 'क्या आपके परिवार में किसी को दिल की बीमारी है?',
    type: 'yesno',
    score_if_yes: 1,
  },
];

export function getCBACRisk(score: number): { category: 'low' | 'moderate' | 'high'; color: string; message: string } {
  if (score <= 2) return { category: 'low', color: '#16A34A', message: 'Low risk. Maintain your healthy lifestyle.' };
  if (score <= 4) return { category: 'moderate', color: '#F59E0B', message: 'Moderate risk. Get a health check soon.' };
  return { category: 'high', color: '#DC2626', message: 'High risk. Please see a doctor this week.' };
}
