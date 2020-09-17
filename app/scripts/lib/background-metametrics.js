import { getBackgroundMetaMetricState } from '../../../ui/app/selectors'
import { sendMetaMetricsEvent } from '../../../ui/app/helpers/utils/metametrics.util'

export default function backgroundMetaMetricsEvent (tronMaskState, version, eventData) {
  const stateEventData = getBackgroundMetaMetricState({ tronmask: tronMaskState })
  if (stateEventData.participateInMetaMetrics) {
    sendMetaMetricsEvent({
      ...stateEventData,
      ...eventData,
      version,
      currentPath: '/background',
    })
  }
}
