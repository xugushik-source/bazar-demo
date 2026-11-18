-- Owner 18.11: an order made in the evening (or at night) for the next morning is repeated to the team at the start of the working
-- day, once, so it is not forgotten. One row per order: the day it was repeated.
CREATE TABLE IF NOT EXISTS morning_repeats(order_id TEXT PRIMARY KEY REFERENCES orders(id),day TEXT NOT NULL,at TEXT NOT NULL);
