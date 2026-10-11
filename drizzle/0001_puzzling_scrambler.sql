CREATE TABLE `file` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`key` text NOT NULL,
	`hash` text,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`type` text,
	`url` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `file_slug_unique` ON `file` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `file_key_unique` ON `file` (`key`);--> statement-breakpoint
CREATE INDEX `file_userId_idx` ON `file` (`user_id`);