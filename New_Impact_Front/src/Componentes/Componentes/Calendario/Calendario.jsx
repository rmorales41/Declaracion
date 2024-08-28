import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function Calendario({ nombreLabel, obtenerFecha, value , disabled}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker 
          label={nombreLabel} 
          onChange={obtenerFecha} 
          value={value ? dayjs(value) : null}
          disabled={disabled}
          />
      </DemoContainer>
    </LocalizationProvider>
  );
}