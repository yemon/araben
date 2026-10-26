import type { SectionCrud } from '@/lib/admin/routes';
import {
  deleteScenario,
  getScenarioInput,
  listScenarios,
  readScenarioInput,
  saveScenario,
  type ScenarioInput,
} from '@/lib/admin/scenarios';

export const scenarioCrud: SectionCrud<ScenarioInput> = {
  label: 'Scenario',
  list: listScenarios,
  get: getScenarioInput,
  read: readScenarioInput,
  save: saveScenario,
  remove: deleteScenario,
};
