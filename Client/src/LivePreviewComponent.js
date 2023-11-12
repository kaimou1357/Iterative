import * as React from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';

const LivePreviewComponent = ({ code }) => (
  <div className="mt-4">
    <h3>React Code Preview:</h3>
    <LiveProvider code={code} scope={{ React }}>
      <LiveError />
      <LivePreview />
    </LiveProvider>
  </div>
);

export default LivePreviewComponent;

