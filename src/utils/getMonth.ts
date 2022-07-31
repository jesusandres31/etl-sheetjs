/**
 * translate month name from spansih to english
 */
export const getMonth = (name: string | null) => {
  switch (name) {
    case 'Enero':
      return 'january';
    case 'Febrero':
      return 'february';
    case 'Marzo':
      return 'march';
    case 'Abril':
      return 'april';
    case 'Mayo':
      return 'may';
    case 'Junio':
      return 'june';
    case 'Julio':
      return 'july';
    case 'Agosto':
      return 'august';
    case 'Septiembre':
      return 'september';
    case 'Octubre':
      return 'october';
    case 'Noviembre':
      return 'november';
    case 'Diciembre':
      return 'december';
    case null:
      return null;
    default:
      return null;
  }
};
