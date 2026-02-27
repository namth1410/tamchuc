
import Hero from './components/Hero';
import MapSection from './components/MapSection';
import Timeline from './components/Timeline';
import TeamBoard from './components/TeamBoard';
import CarpoolSection from './components/CarpoolSection';
import Checklist from './components/Checklist';
import { GradualBlur } from './components/ui/GradualBlur';

function App() {
  return (
    <div className="min-h-screen bg-forest-50 overflow-hidden font-sans relative">
      <GradualBlur position="top" className="fixed top-0 left-0 w-full h-24 z-[100] pointer-events-none" blurAmount="10px" fadeEnd={100} />
      <GradualBlur position="bottom" className="fixed bottom-0 left-0 w-full h-32 z-[100] pointer-events-none" blurAmount="16px" fadeEnd={100} />

      <Hero />
      <MapSection />
      <Timeline />
      <TeamBoard />
      <CarpoolSection />
      <Checklist />

      {/* Footer */}
      <footer className="bg-forest-900 text-forest-100 py-6 text-center">
        <p className="text-sm opacity-80">
          Chúc hội anh em có một chuyến đi Tam Chúc bão bùng và đáng nhớ! 🌿
        </p>
      </footer>
    </div>
  );
}

export default App;
