import dayjs from 'dayjs';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { Styles } from '../../styles';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from '../CalendarEntry';

/**
 * Properties
 */
interface Props {
  /**
   * Day
   */
  day: dayjs.Dayjs;

  /**
   * Events
   */
  events: CalendarEvent[];

  /**
   * Selected
   */
  selected: boolean;

  /**
   * On Selection Change
   */
  onSelectionChange: (selected: boolean) => void;

  /**
   * From
   */
  from: dayjs.Dayjs;

  /**
   * To
   */
  to: dayjs.Dayjs;

  /**
   * Set Day
   */
  setDay: any;

  /**
   * Set Event
   */
  setEvent: any;

  /**
   * Quick Links
   */
  quickLinks: boolean;

  /**
   * Display Time
   */
  displayTime: boolean;

  /**
   * First Day
   */
  firstDay: string;
}

/**
 * Day
 */
export const Day = ({
  day,
  events,
  selected,
  onSelectionChange,
  from,
  to,
  setDay,
  setEvent,
  quickLinks,
  displayTime,
  firstDay,
}: Props) => {
  /**
   * Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(Styles);

  /**
   * Day
   */
  const isToday = day.isSame(dayjs().startOf('day'));
  const isOutsideInterval = day.isBefore(from.startOf('day')) || day.isAfter(to.startOf('day'));

  /**
   * Entries
   */
  const entries = events.map((event, i) => (
    <CalendarEntry
      key={i}
      event={event}
      day={day}
      outsideInterval={isOutsideInterval}
      onClick={() => {
        setDay(day);
        setEvent(event);
      }}
      quickLinks={quickLinks}
      displayTime={displayTime}
      firstDay={firstDay}
    />
  ));

  return (
    <div
      className={cx(styles.day.background, isOutsideInterval && styles.day.backgroundOutside)}
      onClick={(e) => {
        onSelectionChange(!selected);
      }}
    >
      <div className={cx(styles.day.header)}>
        <div
          className={cx(
            styles.day.text,
            isOutsideInterval && styles.day.outside,
            isToday && styles.day.today,
            selected && styles.day.selected
          )}
        >
          {day.format('D') === '1' ? day.format('MMM D') : day.format('D')}
        </div>
      </div>

      <AutoSizer disableWidth>
        {({ height }) => {
          const heightPerEntry = theme.typography.fontSize + 6;
          if (!height) {
            height = 0;
          }

          const maxNumEvents = Math.max(Math.floor((height - 3 * heightPerEntry) / heightPerEntry), 0);
          const moreEvents = entries.length - maxNumEvents;

          return (
            <>
              {entries.slice(0, maxNumEvents)}
              {moreEvents > 0 && (
                <div onClick={() => setDay(day)} className={styles.day.moreLabel}>{`${moreEvents} more`}</div>
              )}
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
