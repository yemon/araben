import { notFound } from 'next/navigation';
import { getScenarioInput } from '@/lib/admin/scenarios';
import { listScenarioVideos } from '@/lib/admin/scenarioVideos';
import { ScenarioForm } from '../../ScenarioForm';
import { ScenarioVideoManager } from '../../ScenarioVideoManager';

export const metadata = { title: 'Edit scenario' };

export default async function EditScenarioPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const scenario = /^\d+$/.test(id) ? await getScenarioInput(Number(id)) : null;
  if (!scenario) notFound();
  const { id: scenarioId, number, ...rest } = scenario;
  return (
    <>
      <ScenarioForm id={scenarioId} initial={{ ...rest, number: String(number) }} />
      {/* Outside the form: videos are saved one by one, not with it. */}
      <ScenarioVideoManager scenarioId={scenarioId} initial={await listScenarioVideos(scenarioId)} />
    </>
  );
}
