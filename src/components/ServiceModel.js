import React, { Suspense, lazy } from 'react';
import './ServiceModel.css';
import { useLanguage } from '../contexts/LanguageContext';
import ServiceModelHeader from './ServiceModelHeader';

// 懒加载 ServiceModel 的子组件
const ServiceModelServices = lazy(() => import('./ServiceModelServices'));
const WhyConsulting = lazy(() => import('./WhyConsulting'));
const Process = lazy(() => import('./Process'));
const WhoWeHelp = lazy(() => import('./WhoWeHelp'));
const FAQ = lazy(() => import('./FAQ'));
const ServiceModelCTA = lazy(() => import('./ServiceModelCTA'));

const ServiceModel = () => {
  const { content } = useLanguage();
  const serviceModelContent = content.serviceModel;
  const { header, services, whyConsulting, process, whoWeHelp, faq, cta } = serviceModelContent;

  return (
    <section className="service-model-section" id="service-model">
      <div className="service-model-container">
        <ServiceModelHeader header={header} />
        <Suspense fallback={null}>
          <ServiceModelServices services={services} />
        </Suspense>
        <Suspense fallback={null}>
          <WhyConsulting whyConsulting={whyConsulting} />
        </Suspense>
        <Suspense fallback={null}>
          <Process process={process} />
        </Suspense>
        <Suspense fallback={null}>
          <WhoWeHelp whoWeHelp={whoWeHelp} />
        </Suspense>
        <Suspense fallback={null}>
          <FAQ faq={faq} />
        </Suspense>
        <Suspense fallback={null}>
          <ServiceModelCTA cta={cta} />
        </Suspense>
      </div>
    </section>
  );
};

export default React.memo(ServiceModel);
