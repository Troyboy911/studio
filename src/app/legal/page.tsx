import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Legal Information</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Understanding your rights and responsibilities on IDream.
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-accent" /> Our Commitment to You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            At IDream, we are committed to providing a secure and transparent platform for both Dreamers and Investors. 
            This page outlines the key legal aspects of using our services.
          </p>
          <p>
            Please note that the information provided here is for general guidance only and does not constitute legal advice. 
            We strongly recommend consulting with a legal professional for advice tailored to your specific situation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>For Dreamers</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            When you submit your idea, you retain ownership of your intellectual property. Our platform facilitates connections
            with investors. Any agreements made with investors are between you and the investor. We will provide template
            agreements and suggest seeking independent legal counsel before finalizing any deals.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Terms of Service for Dreamers (Coming Soon)</li>
            <li>Intellectual Property Guidelines (Coming Soon)</li>
            <li>Non-Disclosure Agreement (NDA) Template (Coming Soon)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>For Investors</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Investors on IDream gain access to a curated selection of innovative ideas. All investment decisions and due
            diligence are your responsibility. We provide tools to facilitate offers and will provide template agreements.
            A 6% commission on the first year's income from funded projects and a one-time fee apply as per our terms.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Terms of Service for Investors (Coming Soon)</li>
            <li>Investment Agreement Template (Coming Soon)</li>
            <li>Confidentiality Undertakings (Coming Soon)</li>
          </ul>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Platform Usage</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Our general Terms of Use and Privacy Policy govern your use of the IDream platform. These documents detail
            data handling, user conduct, dispute resolution, and other important aspects of our service.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>General Terms of Use (Coming Soon)</li>
            <li>Privacy Policy (Coming Soon)</li>
            <li>Cookie Policy (Coming Soon)</li>
          </ul>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-10">
        Full legal documentation will be available soon. Thank you for your understanding.
      </p>
    </div>
  );
}
