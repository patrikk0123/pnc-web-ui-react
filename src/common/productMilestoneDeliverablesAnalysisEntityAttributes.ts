import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { TEntityAttributes } from 'common/entityAttributes';

const resultValues: DeliverableAnalyzerOperation['result'][] = [
  'SUCCESSFUL',
  'FAILED',
  'REJECTED',
  'CANCELLED',
  'TIMEOUT',
  'SYSTEM_ERROR',
];

const progressStatusValues: DeliverableAnalyzerOperation['progressStatus'][] = ['NEW', 'PENDING', 'IN_PROGRESS', 'FINISHED'];

interface IExtendedDeliverableAnalyzerOperation extends DeliverableAnalyzerOperation {
  'user.username': any;
  deliverablesUrls: any;
  runAsScratchAnalysis: any;
}

export const productMilestoneDeliverablesAnalysisEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submit Time',
    sort: {},
  },
  startTime: {
    id: 'startTime',
    title: 'Start Time',
  },
  endTime: {
    id: 'endTime',
    title: 'End Time',
  },
  progressStatus: {
    id: 'progressStatus',
    title: 'Progress Status',
    values: progressStatusValues,
    filter: {
      operator: '==',
    },
  },
  result: {
    id: 'result',
    title: 'Result',
    values: resultValues,
    filter: {
      operator: '==',
    },
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    filter: {
      operator: '=like=',
    },
    sort: {},
  },
  parameters: {
    id: 'parameters',
    title: 'Parameters',
  },
  deliverablesUrls: {
    id: 'deliverablesUrls',
    title: 'Deliverables URLs',
  },
  runAsScratchAnalysis: {
    id: 'runAsScratchAnalysis',
    title: 'Run as Scratch',
    tooltip: "This analysis will be run as a 'scratch' analysis, perhaps for testing purposes.",
  },
} as const satisfies TEntityAttributes<IExtendedDeliverableAnalyzerOperation>;
