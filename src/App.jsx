// Kořenová aplikační komponenta – pouze obaluje hlavní mapu.
import WebDevMap from './WebDevMap';

export default function App() {
  // Udržujeme App minimální: deleguje vše na WebDevMap.
  return <WebDevMap />;
}
