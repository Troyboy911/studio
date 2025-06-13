
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ShieldCheck, BookOpen } from 'lucide-react'; // Added BookOpen

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
          <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Platform Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Our general Terms of Use and Privacy Policy govern your use of the IDream platform. These documents detail
            data handling, user conduct, dispute resolution, and other important aspects of our service.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground/90">General Terms of Use (Placeholder)</h4>
            <p className="text-sm">
              Welcome to IDream! These terms and conditions outline the rules and regulations for the use of IDream's Website, located at idream.app.
              By accessing this website we assume you accept these terms and conditions. Do not continue to use IDream if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            <p className="text-sm">
              The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same. This is placeholder text and does not constitute a legally binding agreement.
            </p>
            <p className="text-xs italic mt-1">
              (This is example placeholder content. For a real application, you must consult with a legal professional to draft comprehensive and appropriate Terms of Use.)
            </p>
          </div>

          <ul className="list-disc pl-5 mt-4 space-y-1">
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

