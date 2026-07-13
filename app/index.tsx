import { Redirect } from 'expo-router';

// Entry → tab group.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
