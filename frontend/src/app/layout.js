import './globals.css';
import { inter } from '@/lib/fonts';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  title: 'Around Tax — Free GST Consultancy | Accounting & Tax Services Ranchi',
  description: 'Get free GST consultancy from Around Tax, Ranchi. Complete accounting, tax filing, company registration, MSME, and compliance services. Call 9852560793.',
  keywords: 'GST filing ranchi, income tax ranchi, company registration, accounting services, MSME registration, around tax',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <MetaPixel />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
