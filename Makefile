.PHONY: migrations-apply migrations-create run

migrations-apply:
	npx drizzle-kit migrate

migrations-create:
	npx drizzle-kit generate
	
run:
	npm run dev