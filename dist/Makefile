.PHONY: all dirs clean

CFLAGS += -E -P -xc
TARGETs = build/$(NAME)-de.html build/$(NAME)-en.html build/$(NAME)-de.js \
	build/$(NAME)-en.js build/$(NAME).css debug/$(NAME)-de.html \
	debug/$(NAME)-en.html build/cto.config.json

all: dirs $(TARGETs)

dirs:
	mkdir -p build debug

build/$(NAME).css: $(NAME).css
	cp $^ $@

build/$(NAME)-de.html: $(NAME).html de-txts.h
	$(CC) $(CFLAGS) -DLANG_DE=1 -DFILE=$(NAME).html dist/localize.h >$@

build/$(NAME)-en.html: $(NAME).html en-txts.h
	$(CC) $(CFLAGS) -DLANG_EN=1 -DFILE=$(NAME).html dist/localize.h >$@

build/$(NAME)-de.js: $(NAME).js de-txts.h
	$(CC) $(CFLAGS) -DLANG_DE=1 -DFILE=$(NAME).js dist/localize.h >$@

build/$(NAME)-en.js: $(NAME).js en-txts.h
	$(CC) $(CFLAGS) -DLANG_EN=1 -DFILE=$(NAME).js dist/localize.h >$@

build/cto.config.json: dist/cto.config.json
	$(CC) $(CFLAGS) -DNAME=$(NAME) $^ >$@

debug/$(NAME)-de.html: build/$(NAME)-de.html
	$(CC) $(CFLAGS) -DLANG_DE=1 -DNAME=$(NAME) dist/template.html >$@

debug/$(NAME)-en.html: build/$(NAME)-en.html
	$(CC) $(CFLAGS) -DLANG_EN=1 -DNAME=$(NAME) dist/template.html >$@

clean:
	rm -Rf build debug

