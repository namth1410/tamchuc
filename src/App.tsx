
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import TeamBoard from './components/TeamBoard';
import Checklist from './components/Checklist';

function App() {
  return (
    <div className="min-h-screen bg-forest-50 overflow-hidden font-sans">
      <Hero />
      <Timeline />
      <TeamBoard />
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
