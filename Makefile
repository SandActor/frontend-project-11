NODE_BIN = ./node_modules/.bin
ESLINT = $(NODE_BIN)/eslint
JEST = $(NODE_BIN)/jest
NPM = npm

install:
	$(NPM) install

lint:
	npx eslint .

lint-fix:
	$(ESLINT) --fix .

test:
	NODE_OPTIONS=--experimental-vm-modules $(JEST)

test-coverage:
	NODE_OPTIONS=--experimental-vm-modules $(JEST) --coverage

test-watch:
	NODE_OPTIONS=--experimental-vm-modules $(JEST) --watch

build:
	$(NPM) run build

run:
	node bin/gendiff.js __fixtures__/file1.json __fixtures__/file2.json

run-plain:
	node bin/gendiff.js __fixtures__/file1.json __fixtures__/file2.json --format plain

run-json:
	node bin/gendiff.js __fixtures__/file1.json __fixtures__/file2.json --format json