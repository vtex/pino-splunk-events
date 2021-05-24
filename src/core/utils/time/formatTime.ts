import dateFormat from 'dateformat'

const TIME_FORMAT = 'yyyy-mm-dd HH:MM:ss.l o'

export const formatTime = (time: Date) => dateFormat(time, TIME_FORMAT)
