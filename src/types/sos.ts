export interface SOSSession {

  sessionId: string;

  triggeredBy: string;

  status: string;

  layerActive: number;

  startTime: any;

  endTime: any;

  layer1Alerted: string[];

  layer1Acknowledged: string | null;

}