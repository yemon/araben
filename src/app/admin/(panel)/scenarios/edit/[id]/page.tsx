import { notFound } from 'next/navigation';
import { getScenarioInput } from '@/lib/admin/scenarios';
import { ScenarioForm } from '../../ScenarioForm';

export const metadata = { title: 'Edit scenario' };

export default async function EditScenarioPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const scenario = /^\d+$/.test(id) ? await getScenarioInput(Number(id)) : null;
  if (!scenario) notFound();
  const { id: scenarioId, number, ...rest } = scenario;
  return <ScenarioForm id={scenarioId} initial={{ ...rest, number: String(number) }} />;
}
