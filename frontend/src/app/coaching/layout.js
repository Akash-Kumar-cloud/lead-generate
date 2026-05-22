import './coaching.css';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  title: 'Free Demo Class — SSC/Banking/JEE/NEET 2026 Batch | Top Coaching in Ranchi',
  description: 'Register for FREE Demo Class at Ranchi\'s #1 Coaching Institute. SSC, Banking, JEE, NEET preparation with expert faculty. Limited seats available. Book now!',
  keywords: 'coaching ranchi, SSC coaching, banking coaching, JEE coaching, NEET coaching, free demo class, best coaching institute ranchi',
  openGraph: {
    title: 'Free Demo Class — SSC/Banking 2026 Batch | Top Coaching in Ranchi',
    description: 'Register for FREE Demo Class. Expert faculty, proven results, limited seats.',
    images: ['/images/hero-banner.png'],
  },
};

export default function CoachingLayout({ children }) {
  return (
    <>
      <MetaPixel />
      <GoogleAnalytics />
      {children}
    </>
  );
}
