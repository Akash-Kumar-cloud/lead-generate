import './around-tax.css';
import MetaPixel from '@/components/MetaPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  title: 'Around Tax — Accounting & Tax Services | GST, Income Tax, Company Registration | Ranchi',
  description: 'Free GST Consultancy! Around Tax offers complete accounting, tax filing, company registration, MSME, loan assistance & compliance services in Ranchi. 1000+ happy clients. Call 9852560793.',
  keywords: 'GST filing ranchi, income tax ranchi, company registration ranchi, accounting services, MSME registration, around tax, CA services ranchi',
  openGraph: {
    title: 'Around Tax — FREE GST Consultancy | Accounting & Tax Services Ranchi',
    description: '1000+ happy clients. 10+ years of expertise. Complete accounting, GST, income tax, company registration & compliance services.',
    images: ['/images/around-tax-hero.png'],
  },
};

export default function AroundTaxLayout({ children }) {
  return (
    <>
      <MetaPixel />
      <GoogleAnalytics />
      {children}
    </>
  );
}
