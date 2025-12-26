import React from 'react';
import {
  ChartGroupProvider,
} from './contexts/ChartGroupContext';
import { ChartGroup } from './components/ChartGroup';

export default function App() {
  return (
    <ChartGroupProvider>
      <ChartGroup />
    </ChartGroupProvider>
  );
}
