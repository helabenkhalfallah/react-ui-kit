import React, { Suspense, lazy, } from 'react';
import RKButton from './components/Button/RKButton';

const LazyCssComponent = lazy(() => import('./LazyCssComponent'));

const App = () => (
  <div>
    <Suspense fallback={<div>Chargement...</div>}>
      <LazyCssComponent>
        <RKButton
          disabled={false}
          type="primary"
          icon="download"
          size="large"
          loading={false}
          shape="round"
          onClick={() => console.log('clicked')}
        >
          Click me
        </RKButton>
      </LazyCssComponent>
    </Suspense>
  </div>
);

export default App;
