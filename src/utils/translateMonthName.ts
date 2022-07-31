export const translateMonthName = (name: string) => {
  switch (name) {
    case 'january':
      return 'Enero';
    case 'february':
      return 'Febrero';
    case 'march':
      return 'Marzo';
    case 'april':
      return 'Abril';
    case 'may':
      return 'Mayo';
    case 'june':
      return 'Junio';
    case 'july':
      return 'Julio';
    case 'august':
      return 'Agosto';
    case 'september':
      return 'Septiembre';
    case 'october':
      return 'Octubre';
    case 'november':
      return 'Noviembre';
    case 'december':
      return 'Diciembre';
    default:
      return '-';
  }
};
