import { AIAssistantScreen } from '@screens/AIAssistantScreen';
import { useRouter } from 'expo-router';

export default function AIAssistantRoute() {
  const router = useRouter();
  return <AIAssistantScreen onBack={() => router.back()} />;
}