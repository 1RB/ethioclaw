import { type Metadata } from "next";
import { LegalLayout } from "~/app/_components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of EthioClaw.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 26, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the EthioClaw
        platform and services (&ldquo;Service&rdquo;), operated by EthioClaw (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Service, you agree to be
        bound by these Terms. If you do not agree, you may not use the Service.
      </p>

      <h2>1. Description of Service</h2>
      <p>
        EthioClaw is an autonomous AI agent platform that connects to third-party services
        via OAuth on your behalf. The Service allows you to delegate tasks to an AI agent
        that can read, write, and interact with connected tools according to your instructions.
      </p>
      <p>
        We do not guarantee that the Service will be available at all times, error-free,
        or secure from unauthorized access. The Service is provided on an &ldquo;as is&rdquo; and
        &ldquo;as available&rdquo; basis.
      </p>

      <h2>2. User Accounts</h2>
      <p>
        To use the Service, you must create an account. You are responsible for maintaining
        the confidentiality of your account credentials and for all activities that occur under
        your account. You must notify us immediately of any unauthorized use of your account.
      </p>
      <p>
        You must provide accurate and complete information when creating your account. You may
        not create accounts by automated means or use false identities.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Violate any applicable laws, regulations, or third-party rights</li>
        <li>Send spam, unsolicited messages, or harass, abuse, or harm others</li>
        <li>Distribute malware, viruses, or any other harmful code</li>
        <li>Attempt to gain unauthorized access to any systems, accounts, or data</li>
        <li>Interfere with or disrupt the integrity or performance of the Service</li>
        <li>Use the Service for any illegal, fraudulent, or malicious purpose</li>
        <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
      </ul>
      <p>
        We reserve the right to suspend or terminate your account if we determine, in our sole
        discretion, that you have violated these Terms.
      </p>

      <h2>4. Third-Party Services and OAuth</h2>
      <p>
        The Service integrates with third-party services that you authorize via OAuth. We are
        not responsible for the availability, functionality, or content of these third-party
        services. Your use of third-party services is governed by their respective terms of
        service and privacy policies.
      </p>
      <p>
        You are solely responsible for the actions your AI agent takes through connected
        services. We strongly recommend reviewing outputs and actions before confirming critical
        operations.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        The Service, including all software, designs, text, graphics, and other content, is
        owned by EthioClaw and protected by intellectual property laws. You are granted a limited,
        non-exclusive, non-transferable license to use the Service for its intended purpose.
      </p>
      <p>
        You retain ownership of any content you create or upload to the Service. By using the
        Service, you grant us a limited license to process your content solely for the purpose
        of providing the Service to you.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, EthioClaw and its affiliates shall not be
        liable for any indirect, incidental, special, consequential, or punitive damages, including
        but not limited to loss of profits, data, use, or goodwill, arising out of or in connection
        with your use of the Service.
      </p>
      <p>
        Our total liability for any claim arising under these Terms shall not exceed the amount
        you paid us for the Service in the twelve (12) months preceding the event giving rise to
        liability, or one hundred U.S. dollars (USD $100), whichever is greater.
      </p>
      <p>
        The limitations above apply regardless of whether the claim is based in contract, tort,
        negligence, strict liability, or any other legal theory, even if we have been advised of
        the possibility of such damages.
      </p>

      <h2>7. Disclaimer of Warranties</h2>
      <p>
        The Service is provided without warranties of any kind, whether express or implied,
        including but not limited to implied warranties of merchantability, fitness for a
        particular purpose, non-infringement, and course of dealing.
      </p>
      <p>
        AI-generated outputs may contain errors, inaccuracies, or unintended actions. You are
        responsible for reviewing and verifying any outputs before acting on them. We do not
        guarantee that the AI agent will perform tasks exactly as instructed or that connected
        services will behave predictably.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may terminate your account at any time by contacting us or using the account
        deletion feature in Settings. Upon termination, your access to the Service will cease
        and we will begin deleting your data in accordance with our Privacy Policy.
      </p>
      <p>
        We may suspend or terminate your access to the Service at any time, with or without
        notice, for any reason, including violation of these Terms, suspected fraud, or to comply
        with legal obligations.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless EthioClaw and its affiliates, officers,
        employees, and agents from any claims, damages, losses, liabilities, and expenses
        (including reasonable attorneys&rsquo; fees) arising out of or related to your use of
        the Service, your violation of these Terms, or your violation of any third-party rights.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the
        jurisdiction in which EthioClaw is established, without regard to its conflict of law
        provisions. Any disputes arising under these Terms shall be resolved in the competent
        courts of that jurisdiction.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may modify these Terms at any time. We will notify you of material changes by
        posting the updated Terms on this page and updating the &ldquo;Last updated&rdquo; date.
        Your continued use of the Service after such changes constitutes your acceptance of the
        new Terms.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:legal@ethioclaw.dev">legal@ethioclaw.dev</a>.
      </p>
    </LegalLayout>
  );
}
