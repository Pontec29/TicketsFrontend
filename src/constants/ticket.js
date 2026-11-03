export const CANALES = [
  { value: 'web', label: 'Web' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
];

export const ESTADOS = [
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'cerrado', label: 'Cerrado' },
];

export const PRIORIDADES = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
];

export const EMPTY_TICKET = {
  titulo: '',
  descripcion: '',
  canal: 'web',
  estado: 'abierto',
  prioridad: 'media',
};

export const PAGE_SIZE = 10;

export function labelOf(options, value) {
  return options.find((option) => option.value === value)?.label ?? value;
}
