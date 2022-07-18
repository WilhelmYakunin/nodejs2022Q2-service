install-deps:
	npm i -D

dev:
	npm run start:dev

lint:
	npx eslint .
test-w:
	npm run test:watch

test:
	npm run test