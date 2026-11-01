import { notFound } from 'next/navigation';
import { getScenarioInput } from '@/lib/admin/scenarios';
import { listScenarioVideos } from '@/lib/admin/scenarioVideos';
import { formatTimecode } from '@/lib/timecode';
import { ScenarioForm } from '../../ScenarioForm';
import { ScenarioVideoManager } from '../../ScenarioVideoManager';

export const metadata = { title: 'Edit scenario' };

export default async function EditScenarioPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const scenario = /^\d+$/.test(id) ? await getScenarioInput(Number(id)) : null;
  if (!scenario) notFound();
  const videos = await listScenarioVideos(scenario.id);
  const { id: scenarioId, number, turns, ...rest } = scenario;
  const first = videos[0];
  return (
    <>
      <ScenarioForm
        id={scenarioId}
        initial={{
          ...rest,
          number: String(number),
          turns: turns.map(({ startMs, ...t }) => ({ ...t, startTime: startMs === null ? '' : formatTimecode(startMs) })),
        }}
        syncVideo={first ? { url: first.url, mimeType: first.mimeType, title: first.title } : null}
      />
      {/* Outside the form: videos are saved one by one, not with it. */}
      <ScenarioVideoManager scenarioId={scenarioId} initial={videos} />
    </>
  );
}
