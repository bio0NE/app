
    import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Bot } from 'lucide-react';
    import PagePlaceholder from '@/components/dashboard/PagePlaceholder';

    const AiAdvisor = () => {
      return (
        <>
          <Helmet>
            <title>AI Threat Advisor | Solid Security</title>
          </Helmet>
          <PagePlaceholder
            icon={Bot}
            title="AI Threat Advisor"
            description="Ask our AI for real-time analysis on contract security, transaction risks, or potential threats. Powered by large language models trained on security data."
            isComingSoon={true}
          />
        </>
      );
    };

    export default AiAdvisor;
  