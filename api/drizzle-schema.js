import { mysqlTable, serial, varchar, text, datetime, timestamp, int, tinyint, mysqlEnum, date, time, char } from 'drizzle-orm/mysql-core';

export const accounts = mysqlTable('accounts', {
  account_id: serial('account_id').primaryKey(),
  account_name: varchar('account_name', { length: 50 }),
  account_username: varchar('account_username', { length: 50 }),
  account_password: varchar('account_password', { length: 50 }),
  account_type: varchar('account_type', { length: 50 }),
  account_creation: varchar('account_creation', { length: 50 }),
});

export const events = mysqlTable('events', {
  event_id: serial('event_id').primaryKey(),
  event_name: varchar('event_name', { length: 50 }).notNull(),
  event_time: time('event_time'),
  event_start_date: date('event_start_date').notNull(),
  event_end_date: date('event_end_date'),
  event_venue: char('event_venue', { length: 50 }),
  event_description: text('event_description'),
  event_photo: text('event_photo'),
  event_dept: varchar('event_dept', { length: 255 }),
  event_status: mysqlEnum('event_status', ['Submitted', 'Approved', 'Denied']).default('Submitted'),
  event_denial_reason: text('event_denial_reason'),
  event_qr_code: varchar('event_qr_code', { length: 255 }),
});

export const chat_messages = mysqlTable('chat_messages', {
  message_id: serial('message_id').primaryKey(),
  chatroom_id: int('chatroom_id').notNull(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  message_content: text('message_content').notNull(),
  sent_at: timestamp('sent_at').defaultNow(),
});

export const joined_events = mysqlTable('joined_events', {
  id: serial('id').primaryKey(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  event_id: int('event_id', { unsigned: true }).notNull(),
  ticket_id: varchar('ticket_id', { length: 255 }).unique(),
  last_read_at: datetime('last_read_at'),
  joined_at: timestamp('joined_at').defaultNow(),
  attended: tinyint('attended').default(0),
  time_in: datetime('time_in'),
  time_out: datetime('time_out'),
});

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  google_id: varchar('google_id', { length: 50 }).unique(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 150 }).unique(),
  picture: text('picture'),
  created_at: timestamp('created_at').defaultNow(),
});
