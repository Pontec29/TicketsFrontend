import { PRIORIDADES, labelOf } from '../../constants/ticket';

export default function PriorityBadge({ prioridad }) {
  return <span className={`badge badge-${prioridad}`}>{labelOf(PRIORIDADES, prioridad)}</span>;
}
