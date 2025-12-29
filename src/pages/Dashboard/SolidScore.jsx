
    import React from 'react';
    import { Helmet } from 'react-helmet';
    import { Sparkles } from 'lucide-react';
    import PagePlaceholder from '@/components/dashboard/PagePlaceholder';

    const SolidScore = () => {
      return (
        <>
          <Helmet>
            <title>Solid Score | Solid Security</title>
          </Helmet>
          <PagePlaceholder
            icon={Sparkles}
            title="Solid Score System"
            description="Earn points for every scan and report you make. Level up through ranks like Guardian, Sentinel, and Elite to unlock badges and rewards."
            isComingSoon={true}
          />
        </>
      );
    };

    export default SolidScore;
  