import { SafetyScoreScreen } from '@screens/SafetyScoreScreen';
import { useRouter } from 'expo-router';

export default function SafetyScoreRoute() {
  const router = useRouter();
  return <SafetyScoreScreen onBack={() => router.back()} />;
}