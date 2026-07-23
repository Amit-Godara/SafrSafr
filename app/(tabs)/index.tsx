// import React from 'react';
// import { useRouter } from 'expo-router';
// import { HomeScreen } from '@screens/HomeScreen';

// export default function HomeTab() {
//   const router = useRouter();
//   return (
//     <HomeScreen
//       onQuickAction={(key) => {
//         if (key === 'score') router.push('/safety-score');
//       }}
//     />
//   );
// }

// import React from 'react';
// import { HomeScreen } from '@screens/HomeScreen';

// export default function HomeTab() {
//   return <HomeScreen />;
// }


import { HomeScreen } from '@screens/HomeScreen';
import { useRouter } from 'expo-router';

export default function HomeTab() {
  const router = useRouter();

  return (
    <HomeScreen
      onQuickAction={(key) => {
        if (key === 'ai') router.push('/safety-score');
      }}
    />
  );
}